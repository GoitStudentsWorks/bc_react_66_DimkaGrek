import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  addCategory,
  deleteCategory,
  editCategory,
} from 'my-redux/Category/operations';
import { selectCategories } from 'my-redux/Category/categorySlice';
import { Icon } from '../../components/Icon/Icon';
import s from './CategoriesModal.module.css';

export const CategoriesModal = ({ type, transportCategory }) => {
  const categories = useSelector(selectCategories);

  const dispatch = useDispatch();
  const ulRef = useRef(null);

  const [categoryName, setCategoryName] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSubmitCategory = e => {
    e.preventDefault();
    if (categoryName.length > 16) {
      toast.error(
        'Category name length must be less than or equal to 16 characters long'
      );
      return;
    }

    if (isEditMode) {
      dispatch(editCategory({ categoryName, categoryId }))
        .unwrap()
        .then(() => setIsEditMode(false))
        .catch(error => toast.error('Error editing category'));
    } else {
      dispatch(addCategory({ type, categoryName }))
        .unwrap()
        .then(() => {
          toast.success('New Category added successfully');

          ulRef.current.scrollTo({
            top: ulRef.current.scrollHeight,
            behavior: 'smooth',
          });
        })
        .catch(error => toast.error('Error adding category'));
    }
    setCategoryName('');
  };

  const handleInputChange = event => {
    setCategoryName(event.target.value);
  };

  const handleChangeCategory = (id, categoryName) => {
    setCategoryName(categoryName);
    setCategoryId(id);

    setIsEditMode(true);
  };

  const handleGetCategory = item => {
    transportCategory(item);
  };

  const handleDeleteCategory = (id, type) => {
    setIsEditMode(false);
    setIsButtonDisabled(true);

    dispatch(deleteCategory({ id, type }))
      .unwrap()
      .then(() => toast.success('Category deleted successfully'))
      .catch(error => {
        toast.error('Cannot delete category with existing transactions');
      })
      .finally(setIsButtonDisabled(false));
  };
  useEffect(() => {
    if (!isEditMode) {
      setCategoryName('');
    }
  }, [isEditMode]);

  return (
    <div className={s.mainBox}>
      <div className={s.box}>
        <h2 className={s.mainTitle}>
          {type === 'expenses' ? 'Expenses' : 'Incomes'}
        </h2>
        <h3 className={s.title}>All Category</h3>

        <ul className={`${s.listWrapper} scroll scrollB`} ref={ulRef}>
          {categories[type].length === 0 ? (
            <li className={s.noobjects}>
              <p className={s.noobjectsP}>There are no categories</p>
            </li>
          ) : (
            categories[type].map(item => (
              <li className={s.listItem} key={item._id}>
                <p>{item.categoryName}</p>

                <ul className={s.listSVG}>
                  <li className={s.listSVGitem}>
                    <button
                      className={s.buttonSVG}
                      onClick={() => handleGetCategory(item)}
                    >
                      <Icon className={s.icon} name="check" size="16" />
                    </button>
                  </li>
                  <li>
                    <button
                      className={s.buttonSVG}
                      onClick={() =>
                        handleChangeCategory(item._id, item.categoryName)
                      }
                    >
                      <Icon className={s.icon} name="edit" size="16" />
                    </button>
                  </li>
                  <li>
                    <button
                      className={s.buttonSVG}
                      onClick={() => handleDeleteCategory(item._id, type)}
                      disabled={isButtonDisabled}
                    >
                      <Icon className={s.icon} name="trash-bin" size="16" />
                    </button>
                  </li>
                </ul>
              </li>
            ))
          )}
        </ul>
      </div>

      <form className={s.formStyle} onSubmit={handleSubmitCategory}>
        <label className={s.labelCategory} htmlFor="categoryInput">
          {isEditMode ? 'Edit Category' : 'New Category'}
        </label>
        <div className={s.inputBox}>
          <input
            type="text"
            id="categoryInput"
            placeholder="Enter the text"
            className={s.inputCategory}
            onChange={handleInputChange}
            value={categoryName}
          />

          <button
            className={s.subbmitButton}
            type="submit"
            disabled={categoryName.length === 0}
          >
            {isEditMode ? 'Edit' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};
