import { useEffect,useState } from "react";

import {
collection,
getDocs,
orderBy,
query,
} from "firebase/firestore";

import {db} from "../firebase/firebase";
import { where } from "firebase/firestore";

import {
Bell,
Calendar,
LoaderCircle,
} from "lucide-react";

function Announcements(){

const[announcements,setAnnouncements]=useState([]);
const[loading,setLoading]=useState(true);

useEffect(()=>{

async function fetchAnnouncements(){

const q = query(
collection(db,"announcements"),
where("active","==",true),
orderBy("createdAt","desc")
);

const snapshot=await getDocs(q);

setAnnouncements(
snapshot.docs.map(doc=>({
id:doc.id,
...doc.data(),
}))
);

setLoading(false);

}

fetchAnnouncements();

},[]);

if(loading){

return(

<div className="flex justify-center py-20">

<LoaderCircle className="animate-spin primary-text"/>

</div>

);

}

return(

<div>

<div className="flex items-center gap-3 mb-8">

<Bell className="primary-text" size={34}/>

<h1 className="text-4xl font-bold">

Announcements

</h1>

</div>

<div className="space-y-6">

{announcements.map(item=>(

<div
key={item.id}
className="card-theme rounded-2xl p-6 shadow-md"
>

<h2 className="text-2xl font-bold">

{item.title}

</h2>

<p className="mt-3 text-theme-muted">

{item.message}

</p>

<div className="flex items-center gap-2 mt-5 text-sm text-theme-muted">

<Calendar size={15}/>

{item.createdAt?.toDate().toLocaleString()}

</div>

</div>

))}

</div>

</div>

);

}

export default Announcements;