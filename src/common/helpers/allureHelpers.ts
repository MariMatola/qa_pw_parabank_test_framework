import { camelCaseToPhrase, capitalize } from './stringHelpers';

export interface LoggerLike {
    debug(message: string): void;
}

export function parseTestTreeHierarchy(
    fileName: string,
    logger: LoggerLike,
): string[] {
    const testFolder = 'tests';

    const attributesCamelCase = fileName
        .substring(fileName.indexOf(testFolder) + testFolder.length + 1)
        .split(/[/\\]/);

    let attributes = attributesCamelCase.map((attribute) =>
        capitalize(camelCaseToPhrase(attribute)),
    );

    const lastSegment = attributes[attributes.length - 1];
    if (attributes.length > 0 && lastSegment?.includes('.spec.js')) {
        attributes = attributes.slice(0, -1);
    }

    logger.debug(`Parsed test hierarchy: ${JSON.stringify(attributes)}`);

    return attributes;
}
