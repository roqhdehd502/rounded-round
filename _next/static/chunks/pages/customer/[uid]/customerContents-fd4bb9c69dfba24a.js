(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[194],{8202:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/customer/[uid]/customerContents",function(){return t(1527)}])},2190:function(e,n,t){"use strict";t.d(n,{G3:function(){return a},ZI:function(){return i},kh:function(){return o},uo:function(){return u},wj:function(){return s}});var c=t(165),r=t.n(c),s=function(e,n){return e.length>n?"".concat(e.substr(0,n+1),"..."):e},i=function(e){return e.toLocaleString("en")},o=function(e){return r()(new Date(e),{objectTime:Date.now(),lang:"ko"})},u=function(e){var n,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"YYYYMMDD",c=new Date(e);switch(t){case"YYYYMMDD":n="".concat(c.getFullYear(),".").concat(c.getMonth()+1,".").concat(c.getDate());break;case"YYYY":n="".concat(c.getFullYear());break;case"MM":n="".concat(c.getMonth());break;case"DD":n="".concat(c.getDate())}return n},a=function(e){return e.replace(/\\n/g,"\n")}},7189:function(e,n,t){"use strict";t.d(n,{Z:function(){return g}});var c=t(1799),r=t(5893),s=t(7294),i=t(9473),o=t(4045),u=t.n(o),a=t(1163),d=t(5675),l=t.n(d),m=t(9403),p=t(8918),f=t(8214),h=t(424),x=t(5144),j=t(9773),b=t(6877);function g(e){var n,t=e.activeIndex,o=(0,s.useContext)(x.ZP).prefix,d=(0,i.I0)(),g=(0,a.useRouter)(),v=(0,i.v9)(function(e){return e.customerInfo.customerObj}),N=(0,i.v9)(function(e){return e.customerInfo.customerInfoObj}),w=(0,i.v9)(function(e){return e.customerSubscribesInfo.customerSubscribes}),y=(0,s.useRef)(null);(0,s.useEffect)(function(){d((0,j.b9)(g.query.uid)),d((0,b.AG)({subscriberUid:v.uid,subscribedUid:g.query.uid}))},[g.query,null==N?void 0:N.uid,w?null===(n=w[0])||void 0===n?void 0:n.subscriberUid:[]]);var I=(0,s.useCallback)(function(){(0,h.V)({header:"이메일 인증 확인 전송",icon:"pi pi-exclamation-triangle",message:"가입하신 이메일 주소로 인증 확인 이메일을 전송하시겠습니까?",position:"top",accept:function(){d(j.Hv()),d(j.kS()),g.replace("/")},reject:function(){}})},[d]),k=(0,s.useCallback)(function(e,n,t){d((0,b.m1)({subscriberUid:e,subscribedUid:n})),y.current.show({severity:"success",summary:"구독 성공",detail:"".concat(t,"님을 구독 하였습니다."),life:3e3})},[d]),C=(0,s.useCallback)(function(e,n){(0,h.V)({header:"구독 취소",icon:"pi pi-exclamation-triangle",message:"정말 구독 취소 하시겠습니까?",position:"top",accept:function(){d((0,b.$o)(e)),y.current.show({severity:"info",summary:"구독 취소",detail:"".concat(n,"님을 구독 취소 하였습니다."),life:3e3})},reject:function(){}})},[d]);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(f.F,{ref:y}),(0,r.jsx)(h.Q,{}),(0,r.jsxs)("div",{className:"card surface-0 p-5 border-round-2xl",children:[(0,r.jsx)("div",{className:"flex align-content-center align-items-center justify-content-center",children:(0,r.jsxs)("div",{className:"card w-30rem",children:[(0,r.jsx)("div",{className:"flex justify-content-center",children:(0,r.jsx)(l(),{className:"border-circle image-align-center",alt:N.displayName,src:N.photoURL?N.photoURL:"".concat(o,"/img/anonymous-user-logo.png"),onError:function(e){return e.target.src="".concat(o,"/img/anonymous-user-logo.png")},width:240,height:240,quality:100})}),(0,r.jsx)("h1",{className:"flex justify-content-center",children:N.displayName?N.displayName:N.customerEmail})]})}),(0,r.jsx)("div",{className:"card w-auto mb-3",children:(0,r.jsx)("div",{className:"flex justify-content-center flex-wrap",children:(0,r.jsx)("div",{className:"flex align-items-center",children:v&&v.uid===N.uid?(0,r.jsxs)(r.Fragment,{children:[v.emailVerified?(0,r.jsx)(m.z,{className:"mr-4 w-8rem p-button-rounded p-button-info",icon:"pi pi-unlock",label:"인증됨",disabled:!0}):(0,r.jsx)(m.z,{className:"mr-4 w-8rem p-button-rounded p-button-info",icon:"pi pi-unlock",label:"인증하기",onClick:function(){return I()}}),(0,r.jsx)(u(),{href:{pathname:"/customer/".concat(v.uid,"/customerProfile/update"),query:{uid:N.uid}},as:"/customer/".concat(v.uid,"/customerProfile/update"),children:(0,r.jsx)(m.z,{className:"ml-4 w-8rem p-button-rounded p-button-warning",icon:"pi pi-pencil",label:"수정하기"})})]}):(0,r.jsx)(r.Fragment,{children:v?(0,r.jsx)(r.Fragment,{children:w.length>=1?(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(m.z,{className:"p-button-rounded p-button-info",icon:"pi pi-check",label:"구독됨",onClick:function(){return C(w[0].docId,N.displayName)}})}):(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(m.z,{className:"p-button-rounded p-button-info",icon:"pi pi-plus",label:"구독하기",onClick:function(){return k(v.uid,N.uid,N.displayName)}})})}):(0,r.jsx)(r.Fragment,{children:(0,r.jsx)("span",{})})})})})}),(0,r.jsx)(p.i,{}),(0,r.jsx)("div",{className:"card w-auto mb-3",children:(0,r.jsx)("div",{className:"flex justify-content-center flex-wrap",children:(0,r.jsxs)("div",{className:"flex align-items-center",children:[(0,r.jsx)(u(),{href:{pathname:"/customer/".concat(N.uid,"/customerContents"),query:(0,c.Z)({},N)},as:"/customer/".concat(N.uid,"/customerContents"),children:(0,r.jsx)(m.z,{className:"w-8rem p-button-rounded".concat(0===t?"":" p-button-outlined"),icon:"pi pi-folder",label:"컨텐츠"})}),(0,r.jsx)(u(),{href:{pathname:"/customer/".concat(N.uid,"/customerCommunity"),query:(0,c.Z)({},N)},as:"/customer/".concat(N.uid,"/customerCommunity"),children:(0,r.jsx)(m.z,{className:"ml-4 mr-4 w-8rem p-button-rounded".concat(1===t?"":" p-button-outlined"),icon:"pi pi-comments",label:"커뮤니티"})}),(0,r.jsx)(u(),{href:{pathname:"/customer/".concat(N.uid,"/customerProfile"),query:(0,c.Z)({},N)},as:"/customer/".concat(N.uid,"/customerProfile"),children:(0,r.jsx)(m.z,{className:"w-8rem p-button-rounded".concat(2===t?"":" p-button-outlined"),icon:"pi pi-user",label:"정보"})})]})})})]}),(0,r.jsx)("div",{className:"mt-4 mb-4"})]})}},1527:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return b}});var c=t(5893),r=t(7294),s=t(9473),i=t(4045),o=t.n(i),u=t(1163),a=t(5675),d=t.n(a),l=t(7862),m=t(9403),p=t(9732),f=t(7189),h=t(2190),x=t(9773),j=t(8070);function b(){var e=(0,s.I0)(),n=(0,u.useRouter)(),t=(0,s.v9)(function(e){return e.customerInfo.customerObj}),i=(0,s.v9)(function(e){return e.customerInfo.customerInfoObj}),a=(0,s.v9)(function(e){return e.customerContentsInfo.customerContents}),b=(0,r.useState)("grid"),g=b[0],v=b[1],N=(0,r.useState)(!0),w=N[0],y=N[1];(0,r.useEffect)(function(){e((0,x.b9)(n.query.uid)),e((0,j.cF)(n.query.uid)),y(!1)},[n.query,null==t?void 0:t.uid,null==i?void 0:i.uid]);var I=function(e,n){var t,r;if(e)switch(n){case"list":return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)("div",{className:"col-12",children:(0,c.jsxs)("div",{className:"product-list-item",children:[(0,c.jsx)(o(),{href:{pathname:"/customer/".concat(i.uid,"/customerContents/").concat(e.docId),query:{uid:i.uid,docId:e.docId}},as:"/customer/".concat(i.uid,"/customerContents/").concat(e.docId),children:(0,c.jsx)(d(),{className:"border-round-2xl image-link",src:e.thumbnail,onError:function(e){return e.target.src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"},width:100,height:100,quality:50})}),(0,c.jsx)("div",{className:"product-list-detail ml-3",children:(0,c.jsx)("div",{className:"product-description",children:(0,c.jsx)("h4",{children:(0,h.wj)(e.title,27)})})}),(0,c.jsx)("div",{className:"product-list-action",children:(0,c.jsxs)("span",{className:"product-price",children:["조회수 ",(0,h.ZI)(1e3),"회 • ",(0,h.kh)(e.uploadDate)]})})]})})});case"grid":return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)("div",{className:"col-12 md:col-4",children:(0,c.jsx)("div",{className:"product-grid-item card surface-0 border-round-2xl",children:(0,c.jsxs)("div",{className:"product-grid-item-content",children:[(0,c.jsx)(o(),{href:{pathname:"/customer/".concat(i.uid,"/customerContents/").concat(e.docId),query:{uid:i.uid,docId:e.docId}},as:"/customer/".concat(i.uid,"/customerContents/").concat(e.docId),children:(0,c.jsx)(d(),{className:"border-round-2xl image-link",src:e.thumbnail,onError:function(e){return e.target.src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"},width:300,height:300,quality:75})}),(0,c.jsx)("div",{className:"product-description",children:(0,c.jsx)("h4",{children:(0,h.wj)(e.title,27)})}),(0,c.jsxs)("span",{className:"product-price",children:["조회수 ",(0,h.ZI)(1e3),"회 • ",(0,h.kh)(e.uploadDate)]})]})})})})}},k=(0,c.jsx)(c.Fragment,{children:(0,c.jsx)("div",{className:"grid grid-nogutter",children:(0,c.jsx)("div",{className:"col-12",style:{textAlign:"right"},children:(0,c.jsx)(l.uE,{layout:g,onChange:function(e){return v(e.value)}})})})});return(0,c.jsx)(c.Fragment,{children:i?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(f.Z,{activeIndex:0}),(0,c.jsx)("div",{className:"dataview-demo",children:(0,c.jsxs)("div",{className:"card surface-0 p-5 border-round-2xl",children:[t&&t.uid===i.uid?(0,c.jsx)("div",{className:"flex justify-content-end",children:(0,c.jsx)(o(),{href:{pathname:"/customer/".concat(t.uid,"/customerContents/create"),query:{uid:t.uid}},as:"/customer/".concat(t.uid,"/customerContents/create"),children:(0,c.jsx)(m.z,{className:"ml-4 w-9rem p-button-rounded p-button-info",icon:"pi pi-plus",label:"새 컨텐츠"})})}):(0,c.jsx)("div",{}),(0,c.jsx)(l.VO,{value:a,layout:g,header:k,itemTemplate:I,paginator:!0,rows:9,loading:w})]})})]}):(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(p.N,{})})})}b.layout="L1"}},function(e){e.O(0,[861,367,362,496,774,888,179],function(){return e(e.s=8202)}),_N_E=e.O()}]);