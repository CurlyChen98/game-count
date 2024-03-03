import CoverSelect from '@/components/form/CoverSelect.vue';
import CoverAutocomplete from '@/components/form/CoverAutocomplete.vue';
import CoverDate from '@/components/form/CoverDate.vue';
import CoverDateRange from '@/components/form/CoverDateRange.vue';
import CoverDoubleInput from '@/components/form/CoverDoubleInput.vue';
import CoverSwitch from '@/components/form/CoverSwitch.vue';
import CoverSlider from '@/components/form/CoverSlider.vue';
import CoverInput from '@/components/form/CoverInput.vue';
import CoverTextarea from '@/components/form/CoverTextarea.vue';
import CoverRadioGroup from '@/components/form/CoverRadioGroup.vue';
import CoverIconButton from '@/components/form/CoverIconButton.vue';
import CoverFile from '@/components/form/CoverFile.vue';
//
import FormItem from '@/components/form/FormItem.vue';

export default {
  install(Vue) {
    Vue.component('CoverDate', CoverDate);
    Vue.component('CoverDateRange', CoverDateRange);
    Vue.component('CoverSelect', CoverSelect);
    Vue.component('CoverAutocomplete', CoverAutocomplete);
    Vue.component('CoverDoubleInput', CoverDoubleInput);
    Vue.component('CoverSwitch', CoverSwitch);
    Vue.component('CoverSlider', CoverSlider);
    Vue.component('CoverInput', CoverInput);
    Vue.component('CoverTextarea', CoverTextarea);
    Vue.component('CoverRadioGroup', CoverRadioGroup);
    Vue.component('CoverIconButton', CoverIconButton);
    Vue.component('CoverFile', CoverFile);
    //
    Vue.component('FormItem', FormItem);
  },
};
