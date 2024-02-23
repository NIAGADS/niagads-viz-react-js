import React, { useState } from "react"

import { isJSON, isObject } from "@text/utils"
import { TextRenderer } from "@text/types"
import { Link, LinkList } from "@text/Link"

const resolveObjectType = (obj: any) => {
    if (Array.isArray(obj)) {
        if ("url" in obj[0]) {
            return "link_list";
        } else {
            throw new Error(
                `ERROR: Invalid JSON passed to FormattedJSON (a TextRenderer) - unknown array type: ${JSON.stringify(obj)}`
            );
        }
    }

    if (!("value" in obj)) {
        throw new Error(
            `ERROR: Invalid JSON passed to FormattedJSON (a TextRenderer) - missing 'value': ${JSON.stringify(obj)}`
        );
    }

    // check url first b/c links can have tooltips
    if ("url" in obj) {
        return "link";
    }

    if ("tooltip" in obj) {
        return "tooltip";
    }
    // legacy (type == text)
    else if ("text" in obj) {
        return "legacy_plain_text";
    }

    throw new Error(
        `ERROR: Invalid JSON passed to FormattedJSON (a TextRenderer) - unknown JSON Renderer type: ${JSON.stringify(obj)}`
    );
};

// expect 2 types 1: text w/tooltip, 2) link
// assumes "tooltip" = { value: str; tooltip: str}
export const FormattedJSON: React.FC<TextRenderer> = ({ value }) => {
    const obj = isObject(value) ? value : JSON.parse(value);
    const objType = resolveObjectType(obj);
    switch (objType) {
        case "tooltip":
            return <AnnotatedText value={obj} />;
        case "link":
            return <Link value={obj} />;
        case "link_list":
            return <LinkList value={obj} />;
        default: // not handled, so just display value // probably just a legacy text
            return <DefaultText value={value.value} />;
    }
};

export const DefaultText: React.FC<TextRenderer> = ({ value, maxLength = 100 }) => {
    if (isJSON(value)) {
        return <FormattedJSON value={value} />;
    }
    if (value.toString().length > maxLength) {
        return <Clob value={value} maxLength={maxLength} />;
    }
    // catch numerics
    return value
};

// large text, show more or tooltip
// if not JSON & no tooltip, show more
export const Clob: React.FC<TextRenderer> = ({ value, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return isJSON(value) && "tooltip" in value ? (
        <AnnotatedText value={{ value: value.slice(0, maxLength - 3) + "...", tooltip: value.tooltip }} />
    ) : isExpanded ? (
        <div>
            {value} <a onClick={toggleIsExpanded}>Show less</a>
        </div>
    ) : (
        <div>
            {`${value.slice(0, maxLength - 3)}...`} <a onClick={toggleIsExpanded}>Show more</a>
        </div>
    );
};

export const ColoredText: React.FC<TextRenderer> = ({ value, className, muiColor }) => {
    return (
        <span className={className ? className : ""} color={muiColor ? muiColor : ""}>
            {value}
        </span>
    );
};

// text with tooltip value = { value: string, tooltip: string}
// so technically, takes JSON

export const AnnotatedText: React.FC<TextRenderer> = ({ value }) => {
    return (    
        <div title={value.tooltip} arial-label={value.tooltip}>
           <span className="annotated-text">{value.value}</span>
        </div>
    );
};

