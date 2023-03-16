import removeDuplicateFunction from 'functions/removeDublicateFunction';
//
const data = {
  line_of_business: [
    'Medical Devices',
    'Medical Supplies',
    'Hygiene Products',
    'Medicine',
    'Disinfectant Solutions',
    'Medicine',
    'FMCG',
    'Medical Equipments/ Supplies',
    'Medicine/ Medical Supplies',
    'FMCG Supplies',
  ],
};
export const ManufacturerDropDownValues = {
  line_of_business: removeDuplicateFunction(data.line_of_business),
};
