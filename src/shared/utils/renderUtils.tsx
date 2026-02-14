import React from 'react';

/**
 * Renders a component or node that can be passed as a prop.
 * Handles React elements, functional/class components, and raw nodes.
 */
export const renderInjected = (ComponentOrNode: any, props?: any): React.ReactNode => {
    if (!ComponentOrNode) return null;

    // If it's a React Element (already instantiated), clone it
    if (React.isValidElement(ComponentOrNode)) {
        // If it's a DOM element (string type like 'div'), don't pass specialized components props
        if (typeof (ComponentOrNode.type) === 'string') {
            return ComponentOrNode;
        }
        return React.cloneElement(ComponentOrNode as React.ReactElement<any>, props);
    }

    // If it's a functional/class component, render it
    if (typeof ComponentOrNode === 'function') {
        const Component = ComponentOrNode as React.ComponentType<any>;
        return <Component {...props} />;
    }

    // Fallback for strings/numbers or other nodes that don't accept props
    return ComponentOrNode as React.ReactNode;
};
