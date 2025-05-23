import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString } from "../../../utils/common"
import { CustomTkWidgetBase } from "./base"


class Button extends CustomTkWidgetBase{

    static widgetType = "button"
    static displayName = "Button"

    constructor(props) {
        super(props)

        this.state = {
            ...this.state,
            size: { width: 80, height: 40 },
            widgetName: "Button",
            attrs: {
                ...this.state.attrs,
                buttonLabel: {
                    label: "Button Label",
                    tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: {placeholder: "Button label", maxLength: 100}, 
                    value: "Button",
                    onChange: (value) => this.setAttrValue("buttonLabel", value)
                }

            }
        }
    }


    componentDidMount(){
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#029CFF")
        this.setAttrValue("styling.foregroundColor", "#fff")
    }

    generateCode(variableName, parent){

        const labelText = this.getAttrValue("buttonLabel")

        const config = convertObjectToKeyValueString(this.getConfigCode())

        return [
                `${variableName} = ctk.CTkButton(master=${parent}, text="${labelText}")`,
                `${variableName}.configure(${config})`,
                `${variableName}.${this.getLayoutCode()}`
            ]
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()


        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            buttonLabel: this.state.attrs.buttonLabel,
            size: toolBarAttrs.size,

            ...this.state.attrs,

        })
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md 
                            tw-border tw-border-solid tw-border-gray-400 tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-flex tw-place-content-center tw-place-items-center tw-h-full tw-text-center" 
                        ref={this.styleAreaRef}
                        style={this.getInnerRenderStyling()}>
                    {/* {this.props.children} */}
                    <div className="tw-text-sm" style={{color: this.getAttrValue("styling.foregroundColor")}}>
                        {this.getAttrValue("buttonLabel")}
                    </div>
                </div>
            </div>
        )
    }

}


export default Button