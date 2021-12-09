# Salesforce Todo LWC.
A simple Todo Lightning Web Component which shows basic Drag and drop feature.

## Requirements
1. SFDX CLI

## How to run?
Clone the repository
`git clone https://github.com/damankarora/sf-todo-lwc.git`

Change Directory
`cd sf-todo-lwc`

Create new Scratch org
`sfdx force:org:create -s -f config/project-scratch-def.json`

Push Source code to the Scratch org
`sfdx force:source:push`

Open the Scratch org
`sfdx force:org:open`

## How to use the component?

The component is currently exposed to Lightning Homepage. 
1. Open a Lightning app and go to home page.
2. Click the ⚙️ icon and select Edit Page.
3. Scroll down and add the custom lightning component to your page.

## Objects
The components uses a custom object named "ToDo" which has an API name "ToDo__c" It has the standard Name field. A custom field named "Done" (checkbox) is also used with an API name of "Done__c".
