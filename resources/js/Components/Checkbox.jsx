export default function Checkbox({className, id }) {
    return (
        <input
            type="checkbox"
            id={id}
            className={
                'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 ' +
                className
            }
        />
    );
}
