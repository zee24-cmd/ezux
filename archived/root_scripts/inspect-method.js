
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiModelPath = path.join(__dirname, '../docs/api-model.json');

const data = JSON.parse(fs.readFileSync(apiModelPath, 'utf8'));

const findChild = (children, name) => children ? children.find(child => child.name === name) : undefined;

const layoutRef = findChild(data.children, 'EzTableRef');
if (layoutRef) {
    console.log('EzTableRef found.');
    if (layoutRef.children && layoutRef.children.length > 0) {
        const method = layoutRef.children[0];
        console.log('Method:', method.name);
        console.log(JSON.stringify(method, null, 2));
    } else {
        console.log('No methods found in EzTableRef');
    }
} else {
    console.log('EzTableRef not found');
}
