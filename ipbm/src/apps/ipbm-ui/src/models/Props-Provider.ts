// declare function require(name: string);

const inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
var processProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps'),
    eventProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps'),
    linkProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps'),
    documentationProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps'),
    idProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps'),
    nameProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps'),
    conditionalProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ConditionalProps'),
    scriptTaskProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ScriptTaskProps'),
    userTaskProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/UserTaskProps'),
    serviceTaskDelegateProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ServiceTaskDelegateProps'),
    multiInstanceLoopProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/MultiInstanceLoopProps');

// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups(element: any, bpmnFactory: any, elementRegistry: any) {

    const generalGroup = {
        id: 'general',
        label: 'General',
        entries: [],
    };

    idProps(generalGroup, element, elementRegistry);
    nameProps(generalGroup, element);
    processProps(generalGroup, element);

    const detailsGroup = {
        id: 'details',
        label: 'Details',
        entries: [],
    };
    linkProps(detailsGroup, element);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry);
    conditionalProps(detailsGroup, element, bpmnFactory, elementRegistry);
    scriptTaskProps(detailsGroup, element, bpmnFactory, elementRegistry);
    userTaskProps(detailsGroup, element, bpmnFactory, elementRegistry);
    serviceTaskDelegateProps(detailsGroup, element, bpmnFactory, elementRegistry);
    multiInstanceLoopProps(detailsGroup, element, bpmnFactory, elementRegistry);

    const documentationGroup = {
        id: 'documentation',
        label: 'Documentation',
        entries: [],
    };

    documentationProps(documentationGroup, element, bpmnFactory);

    return [
        generalGroup,
        detailsGroup,
        documentationGroup
    ];
}

export default function CustomPropertiesProvider(eventBus: any, bpmnFactory: any, elementRegistry: any): any {
    // @ts-ignore
    PropertiesActivator.call(this, eventBus);
    // @ts-ignore
    this.getTabs = function (element: any) {

        const generalTab = {
            id: 'general',
            label: 'General',
            groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry)
        };

        return [
            generalTab
        ];
    };
}

inherits(CustomPropertiesProvider, PropertiesActivator);
