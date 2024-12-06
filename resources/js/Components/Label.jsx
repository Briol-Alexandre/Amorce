export default function InputLabel({htmlFor, className, labelName}) {
    return (
        <label htmlFor={htmlFor}>
            {labelName}
        </label>
    );
}
