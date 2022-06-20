import { LightningElement } from 'lwc';

export default class MainContainer extends LightningElement {

    handleSelection(event) {
        console.log('the list of names received is ' + event.detail);
    }
}