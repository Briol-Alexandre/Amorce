export default function TextInput({type, id, name, className, placeholder}) {
    return (
        <input type={type} id={id} name={name} className={className} placeholder={placeholder}/>
    );
}
