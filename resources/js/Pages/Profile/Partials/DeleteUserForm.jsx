import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modals/Modal.jsx';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import {useForm} from '@inertiajs/react';
import {useRef, useState} from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        console.log('Opening modal...');
        setIsModalOpen(true); // ouvrir la modal
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        console.log('Closing modal...');
        setIsModalOpen(false); // fermer la modal

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Supprimer le compte
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Une fois votre compte supprimé, toutes ses ressources et données seront définitivement supprimées.
                    Avant de supprimer votre compte, veuillez télécharger toutes les données ou informations que vous
                    souhaitez conserver.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Supprimer le compte
            </DangerButton>

            {/* Passez isModalOpen comme prop */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Êtes-vous sûr(e) de vouloir supprimer ce compte ?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Une fois supprimé, le compte ne sera plus récupérable. Veuillez entrer votre mot de passe pour
                        confirmer.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Annuler
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Supprimer le compte
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}

