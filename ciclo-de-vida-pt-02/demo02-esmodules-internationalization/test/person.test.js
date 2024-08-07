import chai from 'chai';
import mocha from 'mocha';
const {describe, it} = mocha
const {expect} = chai;

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
    console.log(result)

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