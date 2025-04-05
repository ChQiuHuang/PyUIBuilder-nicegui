import Tools from "../../../canvas/constants/tools"
import {convertObjectToKeyValueString, removeKeyFromObject} from "../../../utils/common"
import { NiceGUIWidgetBase } from "./base"
import {CustomTkWidgetBase} from "../../customtk/widgets/base";

// Input.js
export class Input extends NiceGUIWidgetBase {
    static widgetType = "input"
    static displayName = "Input"

    constructor(props) {
        super(props)

        let newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.minSize = {width: 120, height: 36}

        this.state = {
            ...this.state,
            size: { width: 200, height: 36 },
            widgetName: "Input",
            attrs: {
                ...newAttrs,
                styling: {
                    ...newAttrs.styling,
                    foregroundColor: {
                        label: "Text Color",
                        tool: Tools.COLOR_PICKER,
                        value: "#000000",
                        onChange: (value) => {
                            this.setWidgetInnerStyle("color", value)
                            this.setAttrValue("styling.foregroundColor", value)
                        }
                    }
                },
                placeholder: {
                    label: "Placeholder",
                    tool: Tools.INPUT,
                    toolProps: {placeholder: "Placeholder text", maxLength: 100},
                    value: "Enter text...",
                    onChange: (value) => this.setAttrValue("placeholder", value)
                },
                inputType: {
                    label: "Input Type",
                    tool: Tools.SELECT,
                    options: [
                        {label: "Text", value: "text"},
                        {label: "Number", value: "number"},
                        {label: "Password", value: "password"},
                        {label: "Email", value: "email"}
                    ],
                    value: "text",
                    onChange: (value) => this.setAttrValue("inputType", value)
                }
            }
        }
    }

    generateCode(variableName, parent) {
        const placeholder = this.getAttrValue("placeholder")
        const inputType = this.getAttrValue("inputType")

        const code = []

        // Create the input
        if (parent) {
            code.push(`with ${parent}:`)
            code.push(`    ${variableName} = ui.input(placeholder='${placeholder}', input_type='${inputType}')`)
        } else {
            code.push(`${variableName} = ui.input(placeholder='${placeholder}', input_type='${inputType}')`)
        }

        // Add event handling
        code.push(`@${variableName}.change`)
        code.push(`def handle_input_change(e):`)
        code.push(`    pass  # Handle input change`)

        return code
    }

    renderContent() {
        const placeholder = this.getAttrValue("placeholder")
        const inputType = this.getAttrValue("inputType")

        return (
            <div className="tw-flex tw-w-full tw-h-full tw-items-center tw-justify-center">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                    style={this.getInnerRenderStyling()}
                />
            </div>
        )
    }
}

export class Text extends NiceGUIWidgetBase { // Ahh yes, "Text"
    static widgetType = "entry"
    static displayName = "Entry"

    constructor(props) {
        super(props)

        let newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.minSize = {width: 120, height: 80}

        this.state = {
            ...this.state,
            size: { width: 200, height: 120 },
            widgetName: "Entry",
            attrs: {
                ...newAttrs,
                styling: {
                    ...newAttrs.styling,
                    foregroundColor: {
                        label: "Text Color",
                        tool: Tools.COLOR_PICKER,
                        value: "#000000",
                        onChange: (value) => {
                            this.setWidgetInnerStyle("color", value)
                            this.setAttrValue("styling.foregroundColor", value)
                        }
                    }
                },
                placeholder: {
                    label: "Placeholder",
                    tool: Tools.INPUT,
                    toolProps: {placeholder: "Placeholder text", maxLength: 100},
                    value: "Enter text here...",
                    onChange: (value) => this.setAttrValue("placeholder", value)
                },
                defaultValue: {
                    label: "Default Text",
                    tool: Tools.TEXT_AREA,
                    toolProps: {placeholder: "Default text", rows: 3},
                    value: "",
                    onChange: (value) => this.setAttrValue("defaultValue", value)
                },
                rows: {
                    label: "Rows",
                    tool: Tools.NUMBER_INPUT,
                    toolProps: {min: 1, max: 20},
                    value: 5,
                    onChange: (value) => this.setAttrValue("rows", value)
                }
            }
        }
    }

    componentDidMount() {
        super.componentDidMount()
        this.setWidgetInnerStyle("backgroundColor", "#fff")
    }

    generateCode(variableName, parent) {
        const placeholder = this.getAttrValue("placeholder")
        const defaultValue = this.getAttrValue("defaultValue")
        const rows = this.getAttrValue("rows")

        const code = []

        // Create the textarea
        if (parent) {
            code.push(`with ${parent}:`)
            code.push(`    ${variableName} = ui.textarea(`)
            code.push(`        placeholder='${placeholder}',`)
            if (defaultValue) {
                code.push(`        value='${defaultValue}',`)
            }
            code.push(`        rows=${rows})`)
        } else {
            code.push(`${variableName} = ui.textarea(`)
            code.push(`    placeholder='${placeholder}',`)
            if (defaultValue) {
                code.push(`    value='${defaultValue}',`)
            }
            code.push(`    rows=${rows})`)
        }

        // Apply styling
        const foregroundColor = this.getAttrValue("styling.foregroundColor")
        if (foregroundColor) {
            code.push(`${variableName}.style('color: ${foregroundColor}')`)
        }

        // Add event handling
        code.push(`@${variableName}.change`)
        code.push(`def handle_textarea_change(e):`)
        code.push(`    pass  # Handle text change`)

        return code
    }

    getToolbarAttrs() {
        const toolBarAttrs = super.getToolbarAttrs()

        return {
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            placeholder: this.state.attrs.placeholder,
            defaultValue: this.state.attrs.defaultValue,
            rows: this.state.attrs.rows,
            size: toolBarAttrs.size,
            ...this.state.attrs
        }
    }

    renderContent() {
        const placeholder = this.getAttrValue("placeholder") || "Enter text here..."
        const defaultValue = this.getAttrValue("defaultValue") || ""

        return (
            <div className="tw-flex tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden"
                 style={this.getInnerRenderStyling()}>
                <textarea
                    className="tw-w-full tw-h-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-md tw-resize-none tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    style={{
                        ...this.getInnerRenderStyling(),
                        color: this.getAttrValue("styling.foregroundColor") || "#000"
                    }}
                />
            </div>
        )
    }
}