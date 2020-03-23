import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import {Dropdown, Header, Input, Item, Loader} from 'semantic-ui-react';
import api from '../../api';
import Recipe from './Recipe';

const sorters = {
  name: (r1, r2) => r1.name.localeCompare(r2.name),
  createDate: (r1, r2) => moment(r1.createDate, 'YYYY-MM-DD HH:mm:SS')
    .isAfter(moment(r2.createDate, 'YYYY-MM-DD HH:mm:SS')) ? 1 : -1,
};

const sortersOptions = [
  {key: 'name', value: 'name', text: 'By Name'},
  {key: 'createDate', value: 'createDate', text: 'By Date Created'},
];

const getCategoriesOptions = (recipes) => ['', ...new Set(recipes.map(recipe => recipe.category))]
  .map(category => ({key: Math.random(), value: category, text: category || 'don\'t use'}));

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  
  & > * {
    padding-right: 100px;
  }
`;

const RecipesList = () => {
  const [recipes, receiveRecipes] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => { api.fetchAllRecipes().then(receiveRecipes); }, []);

  if (!recipes) {
    return <Loader active inline/>;
  }

  const renderedRecipes = recipes.sort(sorters[sortBy])
    .filter(recipe => recipe.name.toLowerCase().startsWith(name.toLowerCase()))
    .filter(recipe => !category || recipe.category === category)
    .map(recipe => <Recipe key={recipe.id} {...recipe} />);

  return (
    <div>
      <FiltersContainer>
        <Dropdown options={sortersOptions} value={sortBy} onChange={(e, {value}) => setSortBy(value)}/>
        <Dropdown
          options={getCategoriesOptions(recipes)}
          placeholder="category" value={category}
          onChange={(e, {value}) => setCategory(value)}
        />
        <Input value={name} placeholder="Search by name" onChange={(e) => setName(e.target.value)}/>
      </FiltersContainer>
      {renderedRecipes.length ? <Item.Group>{renderedRecipes}</Item.Group> : <Header as="h3">no recipes</Header>}
    </div>
  );
};

export default RecipesList;
