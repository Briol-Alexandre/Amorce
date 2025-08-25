import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    // Fonction pour formater les slugs de permissions en texte lisible
    const formatPermission = (slug) => {
        const permissionMap = {
            'access-funds': 'Peut accéder aux fonds',
            'manage-funds': 'Peut agir sur les fonds',
            'edit-delete-funds': 'Peut modifier / supprimer un fond',
            'access-meetings': 'Peut accéder aux réunions',
            'manage-meetings': 'Peut créer supprimer une réunion',
            'access-detente': 'Peut accéder à la détente',
            'manage-detente': 'Peut agir sur la détente',
            'access-projects': 'Peut accéder aux projets',
            'manage-projects': 'Peut agir sur les projets',
            'create-users': 'Peut créer un utilisateur'
        };

        return permissionMap[slug] || slug;
    };

    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Information du profil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Vous pouvez modifier votre profil en changeant les valeurs ci-dessous
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nom" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <p className='text-gray-500 font-black text-small'>Permissions :</p>
                    <ul className='text-gray-500 text-sm mt-1 pl-4 list-disc'>
                        {user.permissions && user.permissions.length > 0 ? (
                            user.permissions.map((permission, index) => (
                                <li key={index}>{formatPermission(permission)}</li>
                            ))
                        ) : (
                            <li>Aucune permission</li>
                        )}
                    </ul>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
