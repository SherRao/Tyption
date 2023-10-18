import { createClient as createTypeformClient } from "@typeform/api-client";
import { Client as NotionClient } from "@notionhq/client";
import inquirer from "inquirer";
import "dotenv/config";

const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });
const typeform = createTypeformClient({ token: process.env.TYPEFORM_TOKEN });
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

        if(actionResponse.action == "export") {
            const forms = (await typeform.forms.list()).items; //array of Form Partials
            const formChoices = forms.map( (form) => ({ name: form.title, value: form.id }) );
            const formSelectResponse = await inquirer.prompt(
                {
                    type: "list",
                    name: "form",
                    message: "❓ Which form would you like to export to Notion?",
                    choices: formChoices
                }
            );
            const selectedFormId = formSelectResponse.form;
            const selectedForm = await typeform.forms.get({ uid: selectedFormId });
            const selectedFormData = selectedForm.fields;

            const tableData = {};

            // const database = await notion.pages.create(
            //     {
            //         parent: { database_id: process.env.NOTION_PAGE_ID },
            //         properties: columnTitles
            //     }
            // );

            // console.log(database);
        }
    }
};

const createNewTable = async (parentPageId) => {
    const response = await notion.pages.create({
        parent: { database_id: parentPageId },
        properties: {}
    });

    return response;
};

const addDataToTable = async (databaseId, row) => {
    const finalData = {};
    for(const data of row) {
        finalData[data.title] = data.value;
    }

    const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: finalData
    });

    return response;
};

main();
