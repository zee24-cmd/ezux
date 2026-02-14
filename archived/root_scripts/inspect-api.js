
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiModelPath = path.join(__dirname, '../docs/api-model.json');

if (!fs.existsSync(apiModelPath)) {
    console.error('docs/api-model.json not found!');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(apiModelPath, 'utf8'));

// Helper to find a child by name
const findChild = (children, name) => children ? children.find(child => child.name === name) : undefined;

// Inspect EzTable
const componentName = 'EzTable';
const propsName = `${componentName}Props`;
const refName = `${componentName}Ref`;

console.log(`Inspecting ${componentName}...`);

const projectChildren = data.children;

const component = findChild(projectChildren, componentName);
if (component) {
    console.log('Component found:', component.kindString || component.kind);
    // console.log('Comment:', JSON.stringify(component.comment, null, 2));
    if (component.comment) {
        console.log('Has comment');
    }
} else {
    console.log('Component NOT found in root children');
}

const props = findChild(projectChildren, propsName);
if (props) {
    console.log('Props Interface found');
    if (props.children) {
        console.log('Props children count:', props.children.length);
        const sampleProp = props.children[0];
        console.log('Sample Prop Name:', sampleProp.name);
        console.log('Sample Prop Kind:', sampleProp.kindString || sampleProp.kind);
        console.log('Sample Prop Groups:', JSON.stringify(sampleProp.groups, null, 2));
        console.log('Sample Prop Comment:', JSON.stringify(sampleProp.comment, null, 2));
    }
} else {
    console.log('Props Interface NOT found');
}

const ref = findChild(projectChildren, refName);
if (ref) {
    console.log('Ref Interface found');
    if (ref.children) {
        console.log('Ref children count:', ref.children.length);
        const sampleMethod = ref.children[0];
        console.log('Sample Method Name:', sampleMethod.name);
        console.log('Sample Method Kind:', sampleMethod.kindString || sampleMethod.kind);
    }
} else {
    console.log('Ref Interface NOT found');
}
