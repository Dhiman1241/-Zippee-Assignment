import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import moment from 'moment';

const Modal = (props) => {

    const { modalPerson, closeModal, closeBtnRef } = props;
    const [homeworldData, setHomeworldData] = useState(null);
    const [loader,setLoader] = useState(true);

    useEffect(() => {
        getHomeworld();
    }, [])

    async function getHomeworld() {
        if (modalPerson && modalPerson?.homeworld) {
            await axios.get(modalPerson.homeworld).then((res) => {
                setHomeworldData(res.data);
            }).catch((err) => {
                console.error("Error fetching homeworld:", err);
            }).finally(() => {
                setLoader(false);
            })
        }
        else{
            setTimeout(() => {
                setLoader(false);
            }, 2000);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6  "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={closeModal}
                aria-hidden="true"
            />
            <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full mx-auto transform transition-all h-[80vh] overflow-y-scroll">
                {loader ? <Loader /> : (
                    <>
                    <div className="relative">
                    <img
                        src={`https://picsum.photos/seed/${encodeURIComponent(modalPerson.name)}/1200/600`}
                        alt={`${modalPerson.name} hero`}
                        className="w-full h-44 sm:h-56 object-cover"
                    />
                    <button
                        ref={closeBtnRef}
                        onClick={closeModal}
                        className="absolute right-3 top-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow focus:outline-none"
                        aria-label="Close details"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 011.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <h2 id="modal-title" className="text-2xl font-semibold text-gray-900">{modalPerson.name}</h2>
                    <p className="mt-2 text-sm text-gray-600">{modalPerson.birth_year} • {modalPerson.gender}</p>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <p className="font-medium text-gray-800">Height</p>
                            <p className="mt-1">{modalPerson.height} cm</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Mass</p>
                            <p className="mt-1">{modalPerson.mass} kg</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Number of Films</p>
                            <p className="mt-1">{modalPerson.films.length}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Date Added</p>
                            <p className="mt-1">{moment(modalPerson.created).format('DD-MM-yyyy')}</p>
                        </div>
                        {homeworldData &&
                        (<>
                            <div>
                                <p className="font-medium text-gray-800">HomeWorld Name</p>
                                <p className="mt-1">{homeworldData?.name}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">HomeWorld Terrain</p>
                                <p className="mt-1">{homeworldData?.terrain}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">HomeWorld Climate</p>
                                <p className="mt-1">{homeworldData?.climate}</p>
                            </div>
                             <div>
                                <p className="font-medium text-gray-800">HomeWorld Population</p>
                                <p className="mt-1">{homeworldData?.population}</p>
                            </div>
                        </>)
                        }

                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
                        >
                            Close
                        </button>
                        <a
                            href={modalPerson.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            Open on SWAPI
                        </a>
                    </div>
                </div>
                    </>
                )}
                
            </div>
        </div>
    )

};

export default Modal;