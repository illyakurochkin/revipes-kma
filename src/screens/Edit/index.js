import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import api from '../../api';
import {Button, Form, Header, Loader} from 'semantic-ui-react';
import {useForm} from 'react-hook-form';

function Edit() {
  const [recipe, receiveRecipe] = useState(null);
  const id = useLocation().pathname.substring('/edit/'.length);
  const history = useHistory();

  useEffect(() => { api.fetchRecipe(id).then(receiveRecipe); }, []);

  const {register, handleSubmit} = useForm();

  if(!recipe) {
    return <Loader active inline/>;
  }

  const onSubmit = (data) => {
    api.updateRecipe({...recipe, ...data});
    history.push('/recipes');
  };

  return (
    <div>
      <Header as="h1">Edit</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Field>
          <label>Name</label>
          <input name="name" defaultValue={recipe.name} ref={register}/>
        </Form.Field>
        <Form.Field>
          <label>Category</label>
          <input name="category" defaultValue={recipe.category} ref={register}/>
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <input name="shortDesc" defaultValue={recipe.shortDesc} ref={register}/>
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <textarea name="longDesc" defaultValue={recipe.longDesc} ref={register}/>
        </Form.Field>
        <Button primary type='submit'>Submit</Button>
      </Form>
    </div>
  );
}

export default Edit;
