import { launch, Browser, Page } from 'puppeteer';


export class DoListGenerator {

    private browser: Browser | undefined;
    private page: Page | undefined;
    private baseUrl: string;

    constructor( baseUrl: string ) {
        this.baseUrl = baseUrl;
    }


    async initialize() {
        this.browser = await launch( { headless: true } );
        this.page    = await this.browser.newPage();

        this.page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i)
              console.log(`${i}: ${msg.args()[i]}`);
          });

        await this.page.goto( this.baseUrl, { waitUntil: 'networkidle2' } )
        console.log( 'Begging the disorder' );
    }

    async stop() {
        if( this.browser ) {
            console.log( 'I´m going to sleep' );
            await this.browser.close();
        }
    }

    async getTasks() {
        console.log( 'Stealing the tasks 3:)' );

        if ( this.page ) {
            const tasks = await this.page.evaluate( () => {
                let tasks = document.querySelectorAll('.taskCard');

                const infoArr: TaskInfo[] = [];

                tasks.forEach( ( task: Element ) => {
                    const title = task.querySelector( '.card-body > .flexbox > div' )?.innerHTML;
                    const time  = task.querySelector( '.card-body > .flexbox > span' )?.innerHTML;
                    const text  = task.querySelector( '.card-body > .card-text' )?.innerHTML;
                    const tags  = task.querySelectorAll( '.card-body > div:nth-child(5) > .btn-group > span' );
                    const info: TaskInfo = {
                        title, time, text, tags: []
                    };
                    tags.forEach( tag => info.tags?.push( tag.innerHTML ) );
                    infoArr.push( info );

                })

                return infoArr;
            })

            return tasks;
        }
    }

}



export interface TaskInfo {
    title: string | undefined;
    time: string  | undefined;
    text: string  | undefined;
    tags?: string[];
}