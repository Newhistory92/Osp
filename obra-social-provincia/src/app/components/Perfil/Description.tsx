import React from 'react';
import { Button } from "@material-tailwind/react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { DescriptionProps } from '@/app/interfaces/interfaces';


const Description: React.FC<DescriptionProps> = ({ initialDescription, onSave }) => {
  const [description, setDescription] = React.useState(initialDescription);
  const [editMode, setEditMode] = React.useState(false);

  const handleSave = () => {
    onSave(description);
    setEditMode(false);
  };

  const handleCancel = () => {
    setDescription(initialDescription);
    setEditMode(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const characterLimit = 600;
  const remainingCharacters = characterLimit - description.length;

  return (
    <div>
      {editMode ? (
        <div>
          <textarea
            value={description}
            onChange={handleChange}
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Escribe tus pensamientos aquí..."
            maxLength={characterLimit}
          />
          <div className="text-sm text-gray-500">{remainingCharacters} caracteres restantes</div>
          <div className="mt-2 space-x-2">
            <Button 
              className="rounded text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-500 font-medium text-sm px-2.5 py-1.5 text-center inline-flex items-center dark:hover:bg-red-600 dark:focus:ring-red-600"
              onClick={handleCancel}
            >
              <CancelIcon className='mr-1' />
              Cancelar
            </Button>
            <Button 
              className="rounded mb-5 text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium text-sm px-2.5 py-1.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mt-5"
              onClick={handleSave}
            >
                < LabelOutlinedIcon className='mr-1'/>
              Guardar
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          
          </div>
          <div>{initialDescription}</div>
          <Button 
            className="rounded mb-5 text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium text-sm px-2.5 py-1.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mt-5"
            onClick={() => setEditMode(true)}
          >
            <EditOutlinedIcon className='mr-1'/>
            Editar
          </Button>
        </div>
      )}
    </div>
  );
};

export default Description;

