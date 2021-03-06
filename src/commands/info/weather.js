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
 *
 *   Additional Terms 7.b and 7.c of GPLv3 apply to this file:
 *       * Requiring preservation of specified reasonable legal notices or
 *         author attributions in that material or in the Appropriate Legal
 *         Notices displayed by works containing it.
 *       * Prohibiting misrepresentation of the origin of that material,
 *         or requiring that modified versions of such material be marked in
 *         reasonable ways as different from the original version.
 */

const Discord = require('discord.js'),
	commando = require('discord.js-commando'),
	weather = require('yahoo-weather'),
	{deleteCommandMessages, momentFormat} = require('../../util.js');

module.exports = class weatherCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'weather',
			'memberName': 'weather',
			'group': 'info',
			'aliases': ['temp', 'forecast', 'fc', 'wth'],
			'description': 'Get the weather in a city',
			'format': 'CityName',
			'examples': ['weather amsterdam'],
			'guildOnly': false,
			'args': [
				{
					'key': 'city',
					'prompt': 'Weather in which city?',
					'type': 'string'
				}
			]
		});
	}

	convertTimeFormat (input) { // eslint-disable-line one-var
		const ampm = input.match(/\s(.*)$/)[1],
			minutes = Number(input.match(/:(\d+)/)[1]);
		let hours = Number(input.match(/^(\d+)/)[1]),
			sHours = hours.toString(),
			sMinutes = minutes.toString();


		if (ampm === 'pm' && hours < 12) {
			hours += 12;
		}
		if (ampm === 'am' && hours === 12) {
			hours -= 12;
		}

		if (hours < 10) {
			sHours = `0${sHours}`;
		}
		if (minutes < 10) {
			sMinutes = `0${sMinutes}`;
		}

		return `${sHours}:${sMinutes}`;
	}

	convertDays (day) {
		switch (day) {
			case 'Mon':
				return 'Monday';
			case 'Tue':
				return 'Tuesday';
			case 'Wed':
				return 'Wednesday';
			case 'Thu':
				return 'Thursday';
			case 'Fri':
				return 'Friday';
			case 'Sat':
				return 'Saturday';
			case 'Sun':
				return 'Sunday';
			default:
				return 'Unknown Day';
		}
	}

	async run (msg, args) {
		const info = await weather(args.city),
			weatherEmbed = new Discord.MessageEmbed();

		if (info) {
			weatherEmbed
				.setAuthor(`Weather data for ${info.location.city} - ${info.location.country}`)
				.setFooter(`Weather data pulled from ${info.image.title} on ${momentFormat(new Date(), this.client)}`)
				.setThumbnail(info.item.description.slice(19, 56))
				.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
				.addField('💨 Wind Speed', `${info.wind.speed} ${info.units.speed}`, true)
				.addField('💧 Humidity', `${info.atmosphere.humidity}%`, true)
				.addField('🌅 Sunrise', this.convertTimeFormat(info.astronomy.sunrise), true)
				.addField('🌇 Sunset', this.convertTimeFormat(info.astronomy.sunset), true)
				.addField('☀️ Today\'s High', `${info.item.forecast[0].high} °${info.units.temperature}`, true)
				.addField('☁️️ Today\'s Low', `${info.item.forecast[0].low} °${info.units.temperature}`, true)
				.addField('🌡️ Temperature', `${info.item.condition.temp} °${info.units.temperature}`, true)
				.addField('🏙️ Condition', info.item.condition.text, true)
				.addField(`🛰️ Forecast ${this.convertDays(info.item.forecast[1].day)} ${info.item.forecast[1].date.slice(0, -5)}`,
					`High: ${info.item.forecast[1].high} °${info.units.temperature} | Low: ${info.item.forecast[1].low} °${info.units.temperature}`, true)
				.addField(`🛰️ Forecast ${this.convertDays(info.item.forecast[2].day)} ${info.item.forecast[2].date.slice(0, -5)}`,
					`High: ${info.item.forecast[2].high} °${info.units.temperature} | Low: ${info.item.forecast[2].low} °${info.units.temperature}`, true);

			deleteCommandMessages(msg, this.client);

			return msg.embed(weatherEmbed);
		}
		
		return msg.reply('⚠️ an error occured getting weather info for that city');
	}
};