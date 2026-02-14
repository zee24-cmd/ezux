/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '../docs/api');

// Wrapper for creating detailed sections
const wrapInDetails = ($, title, indexContent, memberContent) => {
    const details = $('<details class="tsd-panel-group tsd-member-group tsd-accordion"></details>');
    const summary = $(`<summary class="tsd-accordion-summary" style="cursor: pointer; list-style: none;"><h3>${title}</h3></summary>`);

    const contentDiv = $('<div></div>');
    if (indexContent) {
        if (typeof indexContent === 'string' || indexContent.length) {
            contentDiv.append(indexContent);
        }
    }
    if (memberContent) {
        contentDiv.append(memberContent);
    }

    details.append(summary);
    details.append(contentDiv);
    return details;
};

// Helper to create Sidebar Section
const createSidebarSection = ($, title, $sourceCheerio, headingText = title) => {
    // Look for the specific index section for the given title
    // e.g. "Properties", "Methods"
    // The source file usually has <section class="tsd-index-section"><h3 ...>Properties</h3> ... </section>

    let section = $sourceCheerio(`.tsd-index-section`).filter((i, el) => {
        const h3 = $sourceCheerio(el).find('h3');
        return h3.length > 0 && h3.text().trim() === headingText;
    });

    if (section.length === 0) return null;

    const indexList = section.find('.tsd-index-list');
    if (indexList.length === 0) return null;

    const details = $('<details class="tsd-accordion"><summary class="tsd-accordion-summary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><use href="../assets/icons.svg#icon-chevronDown"></use></svg><h3>' + title + '</h3></summary></details>');
    const detailsDiv = $('<div class="tsd-accordion-details"></div>');

    indexList.find('a').each((i, el) => {
        const $el = $sourceCheerio(el);
        const href = $el.attr('href');
        const text = $el.text();
        // We use the href as is, assuming it points to an anchor in the same page or relative
        const link = $(`<a href="${href}"><span>${text}</span></a>`);
        detailsDiv.append(link);
    });

    details.append(detailsDiv);
    return details;
}

const injectSection = ($, container, sidebarMenu, settingsNav, title, $source, headingText = title) => {
    // 0. Cleanup existing injections to prevent duplicates
    // Cleanup content
    container.find('details.tsd-panel-group.tsd-member-group.tsd-accordion').each((i, el) => {
        if ($(el).find('summary h3').text().trim() === title) {
            $(el).remove();
        }
    });

    // Cleanup sidebar
    sidebarMenu.find('details.tsd-accordion').each((i, el) => {
        if ($(el).find('summary h3').text().trim() === title) {
            $(el).remove();
        }
    });

    // 1. Find Definition Details
    // TyepDoc (depending on theme/version) wraps groups in details > summary > h2
    let $definitions = $source('details.tsd-panel-group.tsd-member-group.tsd-accordion').filter((i, el) => {
        return $source(el).find('h2').text().includes(headingText);
    });

    // 2. Find Index Section
    let $index = $source('.tsd-index-section').filter((i, el) => {
        return $source(el).find('h3').text().includes(headingText);
    });

    if ($definitions.length > 0) {
        // Extract content to re-wrap
        const realContent = $definitions.children().not('summary');

        // Clone to avoid modifying source if reused (though we reload cheerio each time)
        const details = wrapInDetails($, title, $index.length ? $index.clone() : null, realContent.length ? realContent.clone() : null);
        container.append(details);
    }

    // Sidebar
    const sidebarItem = createSidebarSection($, title, $source, headingText);

    // Only insert if sidebarItem was created AND it's not already there (we cleaned it up above, so just checking validity)
    if (sidebarItem && settingsNav.length) {
        sidebarItem.insertBefore(settingsNav);
    }
};

async function enhanceDocs() {
    console.log('Enhancing documentation...');

    const files = glob.sync(`${DOCS_DIR}/**/*.html`);

    const variableFiles = glob.sync(`${DOCS_DIR}/variables/*.html`);

    for (const file of variableFiles) {
        const filename = path.basename(file, '.html');
        // Assume component name matches filename
        const componentName = filename;
        const propsName = `${componentName}Props`;
        const refName = `${componentName}Ref`;

        let content = fs.readFileSync(file, 'utf8');
        const $ = cheerio.load(content);
        let modified = false;

        console.log(`Processing ${componentName}...`);

        const propsFile = path.join(DOCS_DIR, `interfaces/${propsName}.html`);
        const refFile = path.join(DOCS_DIR, `interfaces/${refName}.html`);

        if (fs.existsSync(propsFile)) {
            const propsContent = fs.readFileSync(propsFile, 'utf8');
            const $props = cheerio.load(propsContent);

            const container = $('.col-content');
            const sidebarMenu = $('.col-sidebar .page-menu');
            const settingsNav = sidebarMenu.find('.tsd-navigation.settings');

            // Inject Properties (from props)
            injectSection($, container, sidebarMenu, settingsNav, 'Properties', $props, 'Properties');

            // Inject Events (from props)
            // Note: This relies on properties being grouped/named as 'Events' in the source JSDoc or TypeDoc grouping
            injectSection($, container, sidebarMenu, settingsNav, 'Events', $props, 'Events');

            modified = true;
        }

        if (fs.existsSync(refFile)) {
            const refContent = fs.readFileSync(refFile, 'utf8');
            const $ref = cheerio.load(refContent);

            const container = $('.col-content');
            const sidebarMenu = $('.col-sidebar .page-menu');
            const settingsNav = sidebarMenu.find('.tsd-navigation.settings');

            // Inject Methods (from ref)
            injectSection($, container, sidebarMenu, settingsNav, 'Methods', $ref, 'Methods');

            modified = true;
        }

        // Also check for "Components" or "Slots" group in the main file or props if documented there
        // For now, we stick to the plan of props/ref injection.

        if (modified) {
            fs.writeFileSync(file, $.html());
            console.log(`Updated ${file}`);
        }
    }

    console.log('Documentation enhancement complete.');
}

enhanceDocs().catch(console.error);
