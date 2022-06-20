import { LightningElement, api, track, wire } from 'lwc';
import searchForRecords from '@salesforce/apex/GenericLookUpController.searchForRecords';

export default class GenericLookUp extends LightningElement {
    @api customLabel;
    @api multiSelect = false;
    @track displayConditions = true;
    @track objectAPINames= [];

    @api objName;
    @api queryField;
    @api iconName;
    @api filter = '';
    @api searchPlaceholder='Search';

    @track selectedNames = [];
    @track records;
    @track isValueSelected;
    @track blurTimeout;

    valueOptions = [];
    searchTerm;

    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';

    handleDisplayCondition(){
        this.displayConditions = this.multiSelect ? true : !this.isValueSelected;
    }
    @wire(searchForRecords, {
        tableName : '$objName',
        searchTerm : '$searchTerm'})
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.records = data;
            this.valueOptions = this.records.map(e => e.Name);
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }

    onSelect(event) {
        let selectedName = event.currentTarget.dataset.name;
        this.selectedNames.push(selectedName);
        this.isValueSelected = true;
        this.handleDisplayCondition();
        if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        this.valueOptions = this.valueOptions.filter( ( el ) => !this.selectedNames.includes( el ) );
        this.selecteRecordsChange();
    }

    handleRemovePill(event) {
        let removedName = event.currentTarget.dataset.name;
        var index = this.selectedNames.indexOf(removedName);
        if (index !== -1) {
            this.valueOptions.push(this.selectedNames.splice(index, 1));
            this.isValueSelected = false;
        }
        if (this.selectedNames.length) {
            this.isValueSelected = true;
        }
        this.handleDisplayCondition();
        this.selecteRecordsChange();
    }

    selecteRecordsChange(){
        this.dispatchEvent(new CustomEvent('valueselected', {detail: this.selectedNames}));
    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }
}