
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjusted path to read from docs structure based on typedoc json output location
const apiModelPath = path.join(__dirname, '../docs/api-model.json');
const outputPath = path.join(__dirname, '../docs/API_MANIFEST.md');

if (!fs.existsSync(apiModelPath)) {
    console.error(`API model not found at ${apiModelPath}. Run "npm run docs" first.`);
    process.exit(1);
}

let data;
try {
    data = JSON.parse(fs.readFileSync(apiModelPath, 'utf8'));
} catch (e) {
    console.error("Failed to parse API model JSON:", e);
    process.exit(1);
}

const componentsToAudit = [
    'EzTable',
    'EzScheduler',
    'EzKanban',
    'EzLayout',
    'EzTreeView',
    'EzSignature',
    'AnimatedText'
];

let markdown = '# API Manifest & Audit Report\n\n';
markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;

function findExport(rootChildren, name) {
    if (!rootChildren) return null;
    return rootChildren.find(child => child.name === name);
}

function getCommentSummary(reflection) {
    if (!reflection || !reflection.comment || !reflection.comment.summary) return '';
    return reflection.comment.summary.map(s => s.text).join('').trim().replace(/\n/g, ' ');
}

function getGroupTag(reflection) {
    if (!reflection || !reflection.comment || !reflection.comment.blockTags) return null;
    const groupTag = reflection.comment.blockTags.find(t => t.tag === '@group');
    if (groupTag && groupTag.content && groupTag.content.length > 0) {
        return groupTag.content.map(c => c.text).join('').trim();
    }
    return null;
}

function renderTable(title, items) {
    if (!items || items.length === 0) return '';

    let table = `#### ${title}\n\n`;
    table += `| Name | Description | Group | Status |\n`;
    table += `| :--- | :--- | :--- | :--- |\n`;

    items.forEach(item => {
        const desc = getCommentSummary(item);
        const group = getGroupTag(item);
        const name = item.name;

        let status = '✅';
        const issues = [];
        if (!desc) issues.push('Missing Description');
        if (!group) {
            issues.push('Missing @group');
        }

        if (issues.length > 0) status = '❌ ' + issues.join(', ');

        table += `| \`${name}\` | ${desc || '-'} | ${group || '-'} | ${status} |\n`;
    });

    table += '\n';
    return table;
}

componentsToAudit.forEach(compName => {
    markdown += `## ${compName}\n\n`;

    const exportDef = findExport(data.children, compName);
    if (!exportDef) {
        markdown += `⚠️ **Export not found in index.** Ensure it is exported from \`packages/ezux/src/index.ts\`.\n\n`;
    } else {
        const desc = getCommentSummary(exportDef);
        const group = getGroupTag(exportDef);
        markdown += `**Description**: ${desc || '❌ Missing'}\n\n`;
        markdown += `**Group**: ${group || '❌ Missing'}\n\n`;
    }

    // Process Props
    const propsName = `${compName}Props`;
    const propsDef = findExport(data.children, propsName);

    if (propsDef && propsDef.children) {
        markdown += `### Props Interface: \`${propsName}\`\n\n`;
        markdown += renderTable('Members', propsDef.children);
    } else {
        markdown += `⚠️ **Props Interface \`${propsName}\` not found or empty.**\n\n`;
    }

    // Process Ref
    const refName = `${compName}Ref`;
    const refDef = findExport(data.children, refName);

    if (refDef && refDef.children) {
        markdown += `### Ref Interface: \`${refName}\`\n\n`;
        markdown += renderTable('Methods', refDef.children);
    }

    markdown += '---\n\n';
});

fs.writeFileSync(outputPath, markdown);
console.log(`Successfully generated manifest at: ${outputPath}`);
