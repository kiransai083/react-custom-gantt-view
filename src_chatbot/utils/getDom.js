export const getDOM = (document) => {

    // Get the document object model (DOM) of the current page
    const dom = document.documentElement;

    // Create an empty object to hold the simplified DOM
    const simplifiedDom = {};

    // Recursive function to simplify the DOM tree
    function simplifyElement(element, idPrefix) {
        // Check if the element is interactive or semantically important
        if (element.tagName === "BUTTON" || element.tagName === "INPUT" || element.tagName === "A" || element.tagName == "SELECT" || element.getAttribute("aria-label")) {
            // Generate a unique ID for the element
            const id = `${idPrefix}_${element.tagName.toLowerCase()}_${Object.keys(simplifiedDom).length}`;

            // Add the element to the simplified DOM object with its ID as the key
            simplifiedDom[id] = {
                tag: element.tagName.toLowerCase(),
                text: element.textContent.trim(),
                attributes: {},
            };

            // Add any important attributes of the element to the simplified DOM object
            const attributeNames = ["class", "id", "name", "type", "value", "href", "aria-label"];
            attributeNames.forEach((name) => {
                const value = element.getAttribute(name);
                if (value) {
                    simplifiedDom[id].attributes[name] = value;
                }
            });
        }

        // Recursively simplify each child element
        for (let i = 0; i < element.children.length; i++) {
            const childElement = element.children[i];
            const childIdPrefix = idPrefix ? `${idPrefix}_${i}` : i.toString();

            simplifyElement(childElement, childIdPrefix);
        }
    }

    // Call the recursive function to simplify the DOM tree
    simplifyElement(dom, "");

    // Generate a JSON string from the simplified DOM object
    // const jsonString = JSON.stringify(simplifiedDom);


    return simplifiedDom;


}