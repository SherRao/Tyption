import { createClient as createTypeformClient } from "@typeform/api-client";
import { Client as NotionClient } from "@notionhq/client";
import inquirer from "inquirer";

const notion = new NotionClient({ auth: process.env.VITE_NOTION_TOKEN });
const typeform = createTypeformClient({ token: process.env.VITE_TYPEFORM_TOKEN });
const running = true;

const main = async () => {
    while(running) {
        const actionResponse = await inquirer.prompt(
            {
                type: "list",
                name: "action",
                message: "❓ What do you want to do?",
                choices: [ 
                    { name: "Export Table From Typeform to Notion", value: "export" },
                    { name: "Random merch giveaway selection", value: "rng" } 
                ]
            }
        );
        console.log("actionResponse", actionResponse);
        
        if(actionResponse.action == "export") {
            const forms = await typeform.forms.list({ page: "auto" });
            const formChoices = forms.map( (form) => ({ name: form.title, value: form.id }) );
            const formSelectResponse = await inquirer.prompt(
                {
                    type: "list",
                    name: "form",
                    message: "❓ Which form would you like to export to Notion?",
                    choices: formChoices
                }
            );
            console.log("formSelectResponse", formSelectResponse);

            const selectedFormId = formSelectResponse.form.id;
            const selectedForm = forms.find((element) => element.id == selectedFormId);
            const selectedFormData = selectedForm.fields;            
            console.log("selectedFormData", selectedFormData);
        }
    }
};

main();
