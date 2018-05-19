/*
 *   This file is part of discord-self-bot
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const {Command} = require('discord.js-commando'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class lmgtfyCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'lmgtfy',
      memberName: 'lmgtfy',
      group: 'searches',
      aliases: ['dumb'],
      description: 'Produce a lmgtfy (let me google that for you) URL',
      format: 'Query',
      examples: ['lmgtfy is it legal to kill an ant???', 'lmgtfy are there birds in canada?'],
      guildOnly: false,
      args: [
        {
          key: 'question',
          prompt: 'What does the idiot want to find?',
          type: 'string',
          parse: p => p.replace(/ /gim, '+')
        }
      ]
    });
  }

  run (msg, args) {
    deleteCommandMessages(msg, this.client);

    return msg.say(`https://lmgtfy.com/?q=${args.question}`);
  }
};