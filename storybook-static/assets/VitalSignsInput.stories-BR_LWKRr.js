import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as m}from"./index-oxIuDU2I.js";import"./_commonjsHelpers-CqkleIqs.js";const H="_root_k2hvj_1",k="_legend_k2hvj_8",T="_grid_k2hvj_15",U="_field_k2hvj_22",D="_label_k2hvj_27",M="_input_k2hvj_32",O="_hint_k2hvj_45",n={root:H,legend:k,grid:T,field:U,label:D,input:M,hint:O};function l(t){const e=t.trim();if(e==="")return;const r=Number(e);return Number.isFinite(r)?r:void 0}function P(t){if(t!=null&&(t<95||t>104))return"Unusual temperature"}function q(t){if(t!=null&&(t<40||t>180))return"Unusual heart rate"}function B(t,e){if(!(t==null&&e==null)){if(t!=null&&(t<70||t>220)||e!=null&&(e<40||e>140))return"Unusual blood pressure";if(t!=null&&e!=null&&e>=t)return"Diastolic should be lower than systolic"}}function E(t){if(t!=null&&(t<85||t>100))return"Unusual SpO₂"}function i({label:t="Vital signs",value:e,onChange:r,disabled:I=!1}){const h=P(e.temperatureF),v=q(e.heartRate),o=B(e.systolic,e.diastolic),g=E(e.spo2);return s.jsxs("fieldset",{className:n.root,disabled:I,children:[s.jsx("legend",{className:n.legend,children:t}),s.jsxs("div",{className:n.grid,children:[s.jsxs("div",{className:n.field,children:[s.jsx("label",{className:n.label,htmlFor:"vs-temp",children:"Temperature (°F)"}),s.jsx("input",{id:"vs-temp",className:n.input,inputMode:"decimal",value:e.temperatureF??"",onChange:a=>r({...e,temperatureF:l(a.target.value)}),"aria-describedby":h?"vs-temp-hint":void 0}),h?s.jsx("div",{id:"vs-temp-hint",className:n.hint,role:"note",children:h}):null]}),s.jsxs("div",{className:n.field,children:[s.jsx("label",{className:n.label,htmlFor:"vs-hr",children:"Heart rate (bpm)"}),s.jsx("input",{id:"vs-hr",className:n.input,inputMode:"numeric",value:e.heartRate??"",onChange:a=>r({...e,heartRate:l(a.target.value)}),"aria-describedby":v?"vs-hr-hint":void 0}),v?s.jsx("div",{id:"vs-hr-hint",className:n.hint,role:"note",children:v}):null]}),s.jsxs("div",{className:n.field,children:[s.jsx("label",{className:n.label,htmlFor:"vs-sys",children:"BP systolic (mmHg)"}),s.jsx("input",{id:"vs-sys",className:n.input,inputMode:"numeric",value:e.systolic??"",onChange:a=>r({...e,systolic:l(a.target.value)}),"aria-describedby":o?"vs-bp-hint":void 0})]}),s.jsxs("div",{className:n.field,children:[s.jsx("label",{className:n.label,htmlFor:"vs-dia",children:"BP diastolic (mmHg)"}),s.jsx("input",{id:"vs-dia",className:n.input,inputMode:"numeric",value:e.diastolic??"",onChange:a=>r({...e,diastolic:l(a.target.value)}),"aria-describedby":o?"vs-bp-hint":void 0}),o?s.jsx("div",{id:"vs-bp-hint",className:n.hint,role:"note",children:o}):null]}),s.jsxs("div",{className:n.field,children:[s.jsx("label",{className:n.label,htmlFor:"vs-spo2",children:"SpO₂ (%)"}),s.jsx("input",{id:"vs-spo2",className:n.input,inputMode:"numeric",value:e.spo2??"",onChange:a=>r({...e,spo2:l(a.target.value)}),"aria-describedby":g?"vs-spo2-hint":void 0}),g?s.jsx("div",{id:"vs-spo2-hint",className:n.hint,role:"note",children:g}):null]})]})]})}i.__docgenInfo={description:"",methods:[],displayName:"VitalSignsInput",props:{label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Vital signs"',computed:!1}},value:{required:!0,tsType:{name:"VitalSigns"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(next: VitalSigns) => void",signature:{arguments:[{type:{name:"VitalSigns"},name:"next"}],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const G={title:"Components/VitalSignsInput",component:i},u={render:()=>{const[t,e]=m.useState({});return s.jsx(i,{value:t,onChange:e})}},d={render:()=>{const[t,e]=m.useState({temperatureF:98.6,heartRate:72,systolic:120,diastolic:80,spo2:98});return s.jsx(i,{value:t,onChange:e})}},c={render:()=>{const[t,e]=m.useState({temperatureF:105,heartRate:190,systolic:90,diastolic:95,spo2:82});return s.jsx(i,{value:t,onChange:e})}},p={render:()=>{const[t,e]=m.useState({temperatureF:98.6,heartRate:72});return s.jsx(i,{value:t,onChange:e,disabled:!0})}};var f,b,j;u.parameters={...u.parameters,docs:{...(f=u.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<VitalSigns>({});
    return <VitalSignsInput value={value} onChange={setValue} />;
  }
}`,...(j=(b=u.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};var x,V,S;d.parameters={...d.parameters,docs:{...(x=d.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<VitalSigns>({
      temperatureF: 98.6,
      heartRate: 72,
      systolic: 120,
      diastolic: 80,
      spo2: 98
    });
    return <VitalSignsInput value={value} onChange={setValue} />;
  }
}`,...(S=(V=d.parameters)==null?void 0:V.docs)==null?void 0:S.source}}};var N,_,y;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<VitalSigns>({
      temperatureF: 105,
      heartRate: 190,
      systolic: 90,
      diastolic: 95,
      spo2: 82
    });
    return <VitalSignsInput value={value} onChange={setValue} />;
  }
}`,...(y=(_=c.parameters)==null?void 0:_.docs)==null?void 0:y.source}}};var F,C,R;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<VitalSigns>({
      temperatureF: 98.6,
      heartRate: 72
    });
    return <VitalSignsInput value={value} onChange={setValue} disabled />;
  }
}`,...(R=(C=p.parameters)==null?void 0:C.docs)==null?void 0:R.source}}};const J=["Default","Prefilled","InvalidValues","Disabled"];export{u as Default,p as Disabled,c as InvalidValues,d as Prefilled,J as __namedExportsOrder,G as default};
