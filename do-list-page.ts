import { launch, Browser, Page } from 'puppeteer';
import { TaskInfo } from './do-list-generator';


export class DoListPage {

    private browser: Browser | undefined;
    private page: Page | undefined;
    private headless: boolean;
    private baseUrl: string;

    constructor( baseUrl: string, headless = true ) {
        this.baseUrl = baseUrl;
        this.headless = headless;
    }

    async initialize() {
        this.browser = await launch( { headless: this.headless } );
        this.page    = await this.browser.newPage();

        this.page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i)
              console.log(`${i}: ${msg.args()[i]}`);
          });

        await this.page.goto( this.baseUrl, { waitUntil: 'networkidle2' } )
        console.log( 'Begging the login' );
    }

    async login() {
        if ( this.page ) {
            await this.page.type( '#email', 'ing.asiurob@gmail.com', { delay: 50 } );
            await this.page.type( '#password', 'Puppetest1!', { delay: 50 } );
            await this.page.click('.submit_btn');
        }
    }

    async setTasks( tasks: TaskInfo[] | undefined, index: number ) {
        if ( this.page && tasks ) {
            const task = tasks[ index ];

            if( index === 0 ) {
                await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
                await this.page.click('.task_actions', { delay: 500});
            }

            await this.page.click('.task_editor__content_field');
            await this.page.type('.task_editor__content_field', task.title || '', { delay: 25 });
            
            await this.page.type('.task_editor__description_field', task.text || '', { delay: 25 });
            await this.page.click('.reactist_button');

            const newIndex = index + 1;
            console.log( newIndex, tasks.length );
            if( newIndex === tasks.length ) {
                this.stop();
                return;
            } else {
                this.setTasks( tasks, newIndex );
            }



        }


    }

    async stop() {
        if( this.browser ) {
            console.log( 'I´m tired to set tasks' );
            await this.browser.close();
        }
    }


}
