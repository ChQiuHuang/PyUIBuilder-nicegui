import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString, removeKeyFromObject } from "../../../utils/common"
import { CustomTkWidgetBase } from "./base"


class Slider extends CustomTkWidgetBase{

    static widgetType = "scale"
    static displayName = "Scale"

    // FIXME: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use 
    constructor(props) {
        super(props)

        let newAttrs = removeKeyFromObject("styling.foregroundColor", this.state.attrs)


        this.state = {
            ...this.state,
            widgetName: "Scale",
            size: { width: 120, height: 10 },
            fitContent: {width: true, height: true},
            attrs: {
                ...newAttrs,
                styling: {
                    ...newAttrs.styling,
                    // TODO: trough color
                    progressColor: {
                        label: "Progress Color",
                        tool: Tools.COLOR_PICKER, 
                        value: "#029CFF",
                        onChange: (value) => {
                            // this.setWidgetInnerStyle("color", value)
                            this.setAttrValue("styling.progressColor", value)
                        }
                    }
                },
                scale: {
                    label: "Scale",
                    display: "horizontal",
                    min: {
                        label: "Min",
                        tool: Tools.NUMBER_INPUT, // the tool to display, can be either HTML ELement or a constant string
                        toolProps: { placeholder: "min" },
                        value: 0,
                        onChange: (value) => this.setAttrValue("scale.min", value)
                    },
                    max: {
                        label: "Max",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: { placeholder: "max"},
                        value: 100,
                        onChange: (value) => this.setAttrValue("scale.max", value)
                    },
                    step: {
                        label: "Step",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: { placeholder: "max", stringMode: true, step: "0.1"},
                        value: 1,
                        onChange: (value) => this.setAttrValue("scale.step", value)
                    },
                    default: {
                        label: "Default",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: { placeholder: "max", stringMode: true, step: "0.1"},
                        value: 0,
                        onChange: (value) => this.setAttrValue("scale.default", value)
                    }
                },
                orientation: {
                    label: "Orientation",
                    tool: Tools.SELECT_DROPDOWN, 
                    toolProps: {placeholder: "select orientation"},
                    value: "",
                    options: [{value: "horizontal", label: "horizontal"}, {value: "vertical", label: "vertical"}],
                    onChange: (value) => {

                        // const widgetStyling = {
                        //     transformOrigin: "0 0",
                        //     transform: value === "horizontal" ? "rotate(0deg)" : "rotate(90deg)"
                        // }

                        // this.setState((prev) => ({
                        //     widgetOuterStyling: {...prev, ...widgetStyling}
                        // }))
                        // this.setWidgetOuterStyle("transform-origin", "0 0")
                        // this.setWidgetOuterStyle("transform", value === "horizontal" ? "rotate(0deg)" : "rotate(90deg)")
                        this.setAttrValue("orientation", value)
                    }
                },

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#fff")
    }

    generateCode(variableName, parent){
        // TODO: add orientation
        
        const config = this.getConfigCode()

        config["from_"] = this.getAttrValue("scale.min")
        config["to"] = this.getAttrValue("scale.max")
        config["number_of_steps"] = this.getAttrValue("scale.step")

        config["progress_color"] = `"${this.getAttrValue("styling.progressColor")}"`

        if (this.getAttrValue("orientation")){
            config["orientation"] = this.getAttrValue("orientation")
        }

        const defaultValue = this.getAttrValue("scale.default")

        return [
                `${variableName}_var = ctk.DoubleVar(value=${defaultValue})`,
                `${variableName} = ctk.CTkSlider(master=${parent}, variable=${variableName}_var)`,
                `${variableName}.configure(${convertObjectToKeyValueString(config)})`,
                `${variableName}.${this.getLayoutCode()}`
            ]
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()

        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            placeHolder: this.state.attrs.placeHolder,
            size: toolBarAttrs.size,

            ...this.state.attrs,

        })
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden">
                <div className="flex flex-col items-center justify-center h-screen 
                                bg-gray-100" 
                            ref={this.styleAreaRef}
                            style={this.getInnerRenderStyling()}>
                    <div className="w-full max-w-md">
                        <input
                            type="range"
                            min={this.getAttrValue("scale.min")}
                            max={this.getAttrValue("scale.max")}
                            step={this.getAttrValue("scale.step")}
                            value={this.getAttrValue("scale.default")}
                            style={{backgroundColor: this.getAttrValue("styling.troughColor") }}
                            className="tw-pointer-events-none w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                       
                    </div>
                </div>
            </div>
        )
    }

}


export default Slider