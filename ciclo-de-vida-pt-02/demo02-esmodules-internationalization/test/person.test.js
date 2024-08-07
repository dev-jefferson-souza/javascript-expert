import chai from 'chai';
import mocha from 'mocha';
const { describe, it} = mocha
const { expect } = chai;

import Person from './../src/person.js';

describe('Person', () => {
  it('should return a person instance from a string', () => {
    const personAsString = '1 Bike,Carro 12 2002-04-01 2002-05-01';
    const person = Person.generateInstanceFromString(personAsString);

    const expected = {
      from: '2002-04-01',
      to: '2002-05-01',
      vehicles: ['Bike', 'Carro'],
      kmTraveled: '12',
      id: '1',
    }

    expect(person).to.be.deep.equal(expected);
  })

  it('should throw an error if the parameters provided are insufficient to build an instance from a string', () => {
    const insufficientParameters = '1 Bike,Carro 12';
    const result = () => Person.generateInstanceFromString(insufficientParameters);

    expect(result).to.throws('Insufficient parameters provided. Expected 5, but received 3.')
  })

  it('should throw an error if too many parameters were provided to build an instance from a string', () => {
    const tooManyParameters = '1 Bike,Carro 12 2012-05-09 2012-06-09 Petrópolis RJ Brasil';
    const result = () => Person.generateInstanceFromString(tooManyParameters);

    expect(result).to.throws('Too many parameters provided. Expected 5, but received 8.')
  })

  it('should format values using the language provided', () => {
    const person = new Person({
      from: '2002-04-01',
      to: '2002-05-01',
      vehicles: ['Bike', 'Carro'],
      kmTraveled: '12',
      id: '1',
    });

    const result = person.formatted("pt-BR");

    const expected = {
      id: 1,
      vehicles: 'Bike e Carro',
      kmTraveled: '12 km',
      from: '01 de abril de 2002',
      to: '01 de maio de 2002'
    }

    expect(result).to.be.deep.equal(expected);
  })

  it('should format values in english if no language is provided', () => {
    const person = new Person({
      from: '2002-04-01',
      to: '2002-05-01',
      vehicles: ['Bike', 'Carro'],
      kmTraveled: '12',
      id: '1',
    });

    const result = person.formatted();

    const expected = {
      id: 1,
      vehicles: 'Bike and Carro',
      kmTraveled: '12 km',
      from: 'April 01, 2002',
      to: 'May 01, 2002'
    }

    expect(result).to.be.deep.equal(expected);
  })
})