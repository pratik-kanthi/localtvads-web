import PlanInfo from './PlanInfo';
import AddOn from './AddOn';
import PlanText from './PlanText';
import PlanBilling from './PlanBilling';

export default [{
    path: 'info',
    component: PlanInfo,
    name: 'PlanInfo'
},
{
    path: 'addon',
    component: AddOn,
    name: 'AddOn'
},
{
    path: 'text',
    component: PlanText,
    name: 'PlanText'
},
{
    path: 'billing',
    component: PlanBilling,
    name: 'PlanBilling'
}
];