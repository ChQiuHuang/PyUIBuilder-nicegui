
import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString, removeKeyFromObject } from "../../../utils/common"
import { CheckSquareFilled } from "@ant-design/icons"
import { CustomTkWidgetBase } from "./base"
import { Layouts } from "../../../canvas/constants/layouts"
import React from "react"


export class CheckBox extends CustomTkWidgetBase{

    static widgetType = "check_button"
    static displayName = "Check Box"

    constructor(props) {
        super(props)

        // const {layout, ...newAttrs} = this.state.attrs // Removes the layout attribute

        let newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.minSize = {width: 50, height: 30}

        this.state = {
            ...this.state,
            size: { width: 120, height: 30 },
            widgetName: "Check box",
            attrs: {
                ...newAttrs,
                styling: {
                    ...newAttrs.styling,
                    foregroundColor: {
                        label: "Foreground Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#000",
                        onChange: (value) => {
                            this.setWidgetInnerStyle("color", value)
                            this.setAttrValue("styling.foregroundColor", value)
                        }
                    }
                },
                checkLabel: {
                    label: "Check Label",
                    tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: {placeholder: "Button label", maxLength: 100},
                    value: "Checkbox",
                    onChange: (value) => this.setAttrValue("checkLabel", value)
                },
                defaultChecked: {
                    label: "Checked",
                    tool: Tools.CHECK_BUTTON, // the tool to display, can be either HTML ELement or a constant string
                    value: true,
                    onChange: (value) => this.setAttrValue("defaultChecked", value)
                }

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        // this.setAttrValue("styling.backgroundColor", "#fff")
        this.setWidgetInnerStyle("backgroundColor", "#fff0")
    }

    generateCode(variableName, parent){

        const labelText = this.getAttrValue("checkLabel")
        const config = this.getConfigCode()

        const code = [
                `${variableName} = ctk.CTkCheckBox(master=${parent}, text="${labelText}")`,
                `${variableName}.configure(${convertObjectToKeyValueString(config)})`,
            ]

        if (this.getAttrValue("defaultChecked")){
            code.push(`${variableName}.select()`)
        }

        code.push(`${variableName}.${this.getLayoutCode()}`)

        return code
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()

        const attrs = this.state.attrs
        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            checkLabel: attrs.checkLabel,
            size: toolBarAttrs.size,
            ...attrs,
        })
    }

    renderContent(){
        return (
            <div className="tw-flex tw-p-1 tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden"
                style={this.getInnerRenderStyling()}
                >

                <div className="tw-flex tw-gap-2 tw-w-full tw-h-full tw-place-items-center tw-place-content-center">
                    <div className="tw-border-solid tw-border-[#D9D9D9] tw-border-2
                                    tw-min-w-[20px] tw-min-h-[20px] tw-w-[20px] tw-h-[20px]
                                    tw-text-blue-600 tw-flex tw-items-center tw-justify-center
                                    tw-rounded-md tw-overflow-hidden">
                        {
                            this.getAttrValue("defaultChecked") === true &&
                            <CheckSquareFilled className="tw-text-[20px]" />
                        }
                    </div>


                    {this.getAttrValue("checkLabel")}
                </div>

            </div>
        )
    }

}


export class RadioButton extends CustomTkWidgetBase{
    // FIXME: the radio buttons are not visible because of the default heigh provided

    static widgetType = "radio_button"
    
    constructor(props) {
        super(props)

        this.minSize = {width: 50, height: 30}
        
        this.firstDivRef = React.createRef()

        this.state = {
            ...this.state,
            size: { width: 80, height: 30 },
            fitContent: { width: true, height: true },
            widgetName: "Radio button",
            attrs: {
                ...this.state.attrs,
                radios: {
                    label: "Radio Group",
                    tool: Tools.INPUT_RADIO_LIST,
                    value: {inputs: ["default"], selectedRadio: -1},
                    onChange: ({inputs, selectedRadio}) => {
                        this.setAttrValue("radios", {inputs, selectedRadio})
                    }
                }

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        // this.setAttrValue("styling.backgroundColor", "#fff")
        this.setWidgetInnerStyle("backgroundColor", "#fff0")
    }

    generateCode(variableName, parent){

        const {border_width, ...config} = this.getConfigCode()

        if (border_width){
            // there is no border width in RadioButton
            config["border_width_checked"] = border_width
        }

        
        const code = [
            `${variableName}_var = ctk.IntVar()`,
        ]
        const radios = this.getAttrValue("radios")
        // FIXME: Error: ValueError: ['value'] are not supported arguments. Look at the documentation for supported arguments.

        radios.inputs.forEach((radio_text, idx) => {

            const radioBtnVariable = `${variableName}_${idx}`
            code.push(`\n`)
            code.push(`${radioBtnVariable} = ctk.CTkRadioButton(master=${parent}, variable=${variableName}_var, text="${radio_text}", value=${idx})`)
            code.push(`${radioBtnVariable}.configure(${convertObjectToKeyValueString(config)})`)
            code.push(`${radioBtnVariable}.${this.getLayoutCode({index: idx})}`)
        })

        const defaultSelected = radios.selectedRadio

        if (defaultSelected !== -1){
            code.push(`${variableName}_var.set(${defaultSelected})`)
        }
        
        
        return code
    }

    /**
     * 
     * The index is required for pack as in pack every widget would be packed on top of each other in radio button
     */
    getLayoutCode({index=0}){
        let layoutManager = super.getLayoutCode()

        const {layout: parentLayout, direction, gap, align="start"} = this.getParentLayout()
        const absolutePositioning = this.getAttrValue("positioning")  

        
        if (parentLayout === Layouts.PLACE || absolutePositioning){
            const config = {}
            
            const elementRect = this.firstDivRef.current?.getBoundingClientRect()

            config['x'] = Math.trunc(this.state.pos.x)
            config['y'] = Math.trunc(this.state.pos.y)

            if (elementRect?.height){
                config['y'] = Math.trunc(config['y'] + (index * elementRect.height)) // the index is the radiobutton index
            }

            const configStr = convertObjectToKeyValueString(config)

            layoutManager = `place(${configStr})`

        }

        return layoutManager

    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()

        const attrs = this.state.attrs
        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            checkLabel: attrs.checkLabel,
            size: toolBarAttrs.size,
            ...attrs,
        })
    }

    renderContent(){

        const {inputs, selectedRadio} = this.getAttrValue("radios")

        return (
            <div className="tw-flex tw-p-1 tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden"
                ref={this.styleAreaRef}
                style={this.getInnerRenderStyling()}
                >
                <div className="tw-flex tw-flex-col tw-gap-2 tw-w-fit tw-h-fit">
                    {
                        inputs.map((value, index) => {

                            const ref = index === 0 ? this.firstDivRef : null


                            return (
                                <div key={index} ref={ref} className="tw-flex tw-gap-2 tw-w-full tw-h-full tw-place-items-center ">
                                    <div className="tw-border-solid tw-border-[#D9D9D9] tw-border-2
                                                    tw-min-w-[20px] tw-min-h-[20px] tw-w-[20px] tw-h-[20px] 
                                                    tw-text-blue-600 tw-flex tw-items-center tw-justify-center
                                                    tw-rounded-full tw-overflow-hidden tw-p-1">
                                        
                                        {
                                            selectedRadio === index &&
                                                <div className="tw-rounded-full tw-bg-blue-600 tw-w-full tw-h-full">

                                                </div>
                                        }
                                    </div>
                                    <span className="tw-text-base" style={{color: this.state.widgetInnerStyling.foregroundColor}}>
                                        {value}
                                    </span>
                                </div>
                            )
                        })
                        
                    }
                </div>
            </div>
        )
    }

}