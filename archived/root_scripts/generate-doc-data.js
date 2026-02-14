
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiModelPath = path.join(__dirname, '../docs/api-model.json');
const outputPath = path.join(__dirname, '../apps/showcase/src/data/component-docs.json');

if (!fs.existsSync(apiModelPath)) {
    console.error('docs/api-model.json not found! Run `npm run docs` first.');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(apiModelPath, 'utf8'));

// Core components to process
const CORE_COMPONENTS = [
    'EzTable',
    'EzScheduler',
    'EzKanban',
    'EzTreeView', // Add others as needed
    'EzLayout',
    'EzSignature'
];

// Helper to find a child by name in a list of children
const findChild = (children, name) => children ? children.find(child => child.name === name) : undefined;

// Helper to extract relevant data from a property/method
const extractMember = (member) => {
    // console.log('Extracting member:', member.name, member.kind, member.kindString);
    let type = 'any';
    if (member.type) {
        if (member.type.type === 'intrinsic') {
            type = member.type.name;
        } else if (member.type.type === 'reference') {
            type = member.type.name;
        } else if (member.type.type === 'union') {
            type = member.type.types.map(t => t.name || t.value).join(' | ');
        }
        else {
            type = 'complex'; // Simplify for now
        }
    }

    // Default value tag
    let defaultValue = undefined;
    if (member.comment && member.comment.blockTags) {
        const defaultTag = member.comment.blockTags.find(t => t.tag === '@default');
        if (defaultTag && defaultTag.content && defaultTag.content.length > 0) {
            defaultValue = defaultTag.content.map(c => c.text).join('').trim();
        }
    }

    // Description
    let description = '';
    if (member.comment && member.comment.summary) {
        description = member.comment.summary.map(s => s.text).join('');
    } else if (member.signatures && member.signatures[0] && member.signatures[0].comment && member.signatures[0].comment.summary) {
        description = member.signatures[0].comment.summary.map(s => s.text).join('');
    } else if (member.type && member.type.declaration && member.type.declaration.signatures && member.type.declaration.signatures[0] && member.type.declaration.signatures[0].comment && member.type.declaration.signatures[0].comment.summary) {
        description = member.type.declaration.signatures[0].comment.summary.map(s => s.text).join('');
    }

    return {
        name: member.name,
        type,
        defaultValue,
        description
    };
};

const processedData = {};

CORE_COMPONENTS.forEach(componentName => {
    console.log(`Processing ${componentName}...`);
    const projectChildren = data.children;
    const component = findChild(projectChildren, componentName);

    if (!component) {
        console.warn(`Component ${componentName} not found.`);
        return;
    }

    const doc = {
        name: componentName,
        description: '',
        properties: [],
        events: [],
        methods: [],
        subcomponents: []
    };

    // 1. Overview / Description
    if (component.comment && component.comment.summary) {
        doc.description = component.comment.summary.map(s => s.text).join('');
    }

    // 2. Properties & Events (from Props interface)
    const propsName = `${componentName}Props`;
    const propsInterface = findChild(projectChildren, propsName);

    if (propsInterface && propsInterface.children) {
        propsInterface.children.forEach(child => {
            const isEvent = child.groups && child.groups.some(g => g.title === 'Events');
            // Or check naming convention on*
            const isRefEvent = child.name.startsWith('on') && child.type && child.type.type === 'reflection'; // very rough check

            const memberData = extractMember(child);

            // JSDoc @group tag check (more reliable if used)
            let isGroupEvent = false;
            if (child.comment && child.comment.blockTags) {
                if (child.comment.blockTags.some(t => t.tag === '@group' && t.content[0].text.includes('Events'))) {
                    isGroupEvent = true;
                }
            }

            if (isEvent || isGroupEvent) {
                doc.events.push(memberData);
            } else {
                doc.properties.push(memberData);
            }
        });
    }

    // Helper to extract type string
    const extractType = (typeObj) => {
        if (!typeObj) return 'void';
        if (typeObj.type === 'intrinsic') return typeObj.name;
        if (typeObj.type === 'reference') {
            const typeName = typeObj.name;
            if (typeObj.typeArguments) {
                return `${typeName}<${typeObj.typeArguments.map(extractType).join(', ')}>`;
            }
            return typeName;
        }
        if (typeObj.type === 'union') {
            return typeObj.types.map(extractType).join(' | ');
        }
        if (typeObj.type === 'array') {
            return `${extractType(typeObj.elementType)}[]`;
        }
        if (typeObj.type === 'reflection') {
            return 'function';
        }
        return 'any';
    };

    // Helper to extract method details
    const extractMethod = (method) => {
        // Methods usually have signatures
        // If it's a property that is a function, it might have a type.declaration.signatures
        let signature = null;

        if (method.signatures && method.signatures.length > 0) {
            signature = method.signatures[0];
        } else if (method.type && method.type.declaration && method.type.declaration.signatures) {
            signature = method.type.declaration.signatures[0];
        }

        if (!signature) {
            return extractMember(method);
        }

        const name = method.name;

        // Description: Check signature first, then method itself
        let description = '';
        if (signature && signature.comment && signature.comment.summary) {
            description = signature.comment.summary.map(s => s.text).join('');
        } else if (method.comment && method.comment.summary) {
            description = method.comment.summary.map(s => s.text).join('');
        }

        // Params
        const parameters = signature.parameters ? signature.parameters.map(p => ({
            name: p.name,
            type: extractType(p.type),
            description: p.comment?.summary?.map(s => s.text).join('') || '',
            isOptional: p.flags?.isOptional
        })) : [];

        // Return type
        const returnType = extractType(signature.type);

        return {
            name,
            description,
            parameters,
            returnType,
            type: `(${parameters.map(p => `${p.name}${p.isOptional ? '?' : ''}: ${p.type}`).join(', ')}) => ${returnType}`
        };
    };

    // 3. Methods (from Ref interface)
    const refName = `${componentName}Ref`;
    const refInterface = findChild(projectChildren, refName);
    if (refInterface && refInterface.children) {
        refInterface.children.forEach(child => {
            doc.methods.push(extractMethod(child));
        });
    }

    // 4. Subcomponents
    // Logic: Look for 'components' prop in Props to find the interface, then recurse?
    // Or just look for exported interfaces like `${componentName}Components`?
    // Let's look for `${componentName}Components` interface to see *what* subcomponents exist.

    // TODO: This is complex because subcomponents might be simple strings or React components.
    // For now, let's just create a placeholder or try to find known subcomponents if they follow a pattern.

    // actually let's just look for any exported variable/type that starts with componentName and is not Props/Ref/Component itself?
    // Better yet, look at the 'components' prop in the Props interface if it exists.

    if (propsInterface && propsInterface.children) {
        const componentsProp = propsInterface.children.find(c => c.name === 'components');
        if (componentsProp && componentsProp.type && componentsProp.type.type === 'reference') {
            const subCompsInterfaceName = componentsProp.type.name;
            const subCompsInterface = findChild(projectChildren, subCompsInterfaceName);

            if (subCompsInterface && subCompsInterface.children) {
                subCompsInterface.children.forEach(subComp => {
                    // This tells us the component has a subcomponent named subComp.name (e.g. 'Item')

                    // We want to find the Props for this subcomponent.
                    // Usually named `${componentName}${SubCompName}Props`? e.g. EzTreeViewItemProps?
                    // Or we just look for subComp.name in exports if it's exported?

                    // Let's guess the props name: `${componentName}${subComp.name}Props` ? 
                    // No, usually it's `ItemProps` inside the file, but exported as something unique? 

                    // Let's try to assume they are exported as specific names. 
                    // Taking a shortcut: for now we just list the subcomponents found.

                    doc.subcomponents.push({
                        name: subComp.name,
                        description: extractMember(subComp).description,
                        // We can expand this later to find their specific props
                    });
                });
            }
        }
    }


    processedData[componentName] = doc;
});

// Ensure directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
console.log(`Documentation data generated at ${outputPath}`);
