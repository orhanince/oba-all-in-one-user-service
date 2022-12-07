const _ = require('lodash');
const { User } = require('./../models');
const GenericError = require('../utils/generic-error');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const cryptoService = require('./crypto.service');
const paginationOptionGenerator = require('../utils/pagination-option-generator');
/**
 * Get all users
 * @param pagination
 * @param AUTH
 * @returns {Promise<{data: Promise<Model[]> | Promise<any[]>, count: *, status: boolean}>}
 */
async function getAll({ pagination }) {
  const options = paginationOptionGenerator({
    pagination,
    likeColumns: ['id', 'user_id'],
    where: {
      status: true,
    },
  });

  const count = await User.count({
    where: options.where,
  });

  const data = await User.findAll({
    attributes: ['user_id', 'name', 'surname', 'username', 'email'],
    options,
  });

  return {
    status: true,
    count,
    data,
  };
}

/**
 * Create new user
 * @param {string} name
 * @param {string} surname
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{status: boolean, token: (*)}>}
 */
async function createUser({ body }) {
  const { name, surname, email, password } = body || {};
  const foundUser = await User.count({
    where: {
      email: email,
    },
  });

  if (foundUser) {
    throw new GenericError(400, '', `User already exists!`, foundUser);
  }

  const now = moment.utc().toISOString();
  const createUser = await User.create({
    user_id: uuidv4(),
    name: name,
    surname: surname,
    email: email,
    password: cryptoService.hashPassword(password),
    status: 1,
    created_at: now,
    updated_at: now,
  });
  if (createUser) {
    return {
      status: true,
      user_id: createUser.user_id,
      email: createUser.email,
    };
  }
}

/**
 * Get single user form database.
 * @param req
 * @returns {Promise<any>}
 */
async function getUser({ body }) {
  const { user_id, email } = body || {};
  const filter = {
    where: {
      status: true,
      deleted_at: null,
    },
  };
  if (!_.isEmpty(user_id)) {
    filter.where.user_id = user_id;
  } else if (!_.isEmpty(email)) {
    filter.where.email = email;
  }

  const user = await User.findOne(filter);

  return {
    status: true,
    data: user,
  };
}

module.exports = {
  createUser,
  getUser,
  getAll,
};
