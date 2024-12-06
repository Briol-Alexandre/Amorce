import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";

export default function TextAndLabel({containerClassName, idAndFor, inputClassName, placeholder, labelName, inputName, type, labelClassName, errors, onChange}) {
    return (
        <div className={containerClassName}>
            <InputLabel value={labelName} htmlFor={idAndFor} className={labelClassName} />
            <TextInput name={inputName} id={idAndFor} type={type} className={inputClassName}
                       placeholder={placeholder} error={errors} onChange={onChange}/>
        </div>
    );
}
