import React from 'react'

interface DeletePopUp {
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    message?: string
    deleteAction: () => void
}

const DeletePopUp = ({ setShow, message, deleteAction }: DeletePopUp) => {
    return (
        <div className=''>
            <div className='fixed bg-black/40 w-full h-full top-0 left-0 z-50 backdrop-blur-[2px]' onClick={(e) => {
                e.stopPropagation()
                setShow(false)
            }

            }>
            </div>
            <div
                className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] group select-none w-[250px] flex flex-col p-4 items-center justify-center bg-gray-800 border border-gray-800 shadow-lg rounded-2xl z-50"
            >
                <div className="">
                    <div className="text-center p-3 flex-auto justify-center">
                        <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                clipRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                fillRule="evenodd"
                            ></path>
                        </svg>
                        <h2 className="text-xl font-bold py-4 text-gray-200">Are you sure?</h2>
                        <p className="font-bold text-sm text-gray-500 px-2">
                            {message} This process cannot be undone.
                        </p>
                    </div>
                    <div className="p-2 mt-2 text-center space-x-1 flex flex-col gap-3">
                        <button
                            className="bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-150 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShow(false)
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-500 hover:bg-transparent px-5 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 hover:border-red-500 text-white hover:text-red-500 rounded-full transition ease-in duration-150 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShow(false)
                                deleteAction()
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeletePopUp