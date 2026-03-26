export default function GradientCard({title,value,icon}){

return(

<div className="rounded-2xl p-5 text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">

<div className="flex justify-between items-center">

<div>
<p className="text-sm opacity-80">{title}</p>
<h2 className="text-2xl font-bold">{value}</h2>
</div>

<div className="text-3xl opacity-70">
{icon}
</div>

</div>

</div>

)

}