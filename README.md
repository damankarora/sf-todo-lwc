# Salesforce Todo LWC.
A simple Todo Lightning Web Component which shows basic Drag and drop feature.

## Requirements
1. SFDX CLI

## How to run?
Clone the repository <br />
`git clone https://github.com/damankarora/sf-todo-lwc.git`

Change Directory <br />
`cd sf-todo-lwc`

Create new Scratch org <br />
`sfdx force:org:create -f config/project-scratch-def.json -a todo username=my-todo@sf.com`

Push Source code to the Scratch org <br />
`sfdx force:source:push -u todo`

Open the Scratch org <br />
`sfdx force:org:open -u todo`

Make sure to add required custom objects and fields to your org. (See below)


## How to test?
To run the tests after making changes: <br />
`sfdx force:apex:test:run`

To check the codecoverage <br />
`sfdx force:apex:test:run -c -r human`

## How to deploy?

We can deploy our source code with: <br />
`sfdx force:source:deploy -p myapp -u todo`

## How to use the component?

The component is currently exposed to Lightning Homepage. 
1. Open a Lightning app and go to home page.
2. Click the ⚙️ icon and select Edit Page.
3. Scroll down and add the custom lightning component to your page.

## Objects
The components uses a custom object named "ToDo" which has an API name "ToDo__c" It has the standard Name field and following custom fields
> A custom field named "Done" (checkbox) is also used with an API name of "Done__c". 

> Another custom field named "Order" (Number) is used with API name "Order__c".

You can create custom objects and fields using the Salesforce Object manager in your org.
