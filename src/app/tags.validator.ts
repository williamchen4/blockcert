import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[tagValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: TagsValidator,
    multi: true
  }]
})
export class TagsValidator implements Validator {
  @Input('tagValidator') 
  
  tags: string[];



  validate(control: FormControl) {
    //if (this.tags.length >0){
        const hasTag = this.tags.indexOf(control.value) > -1;
        return hasTag
          ? null
          : { duplicateTags: true };
        }
    //}
}