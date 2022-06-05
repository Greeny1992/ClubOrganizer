﻿using Context;
using Context.DAL;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ClubOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;

        [HttpPost("CreatEvent")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Event))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Event>> CreateEvent([Required][FromBody] Event eventData)
        {
            Event ev = await mongo.Event.InsertOrUpdateOneAsync(eventData);


            if (ev != null)
            {


                return ev;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet("ListEvents")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Event>))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<Event>>> ListEvents()
        {


            List<Event> evts = mongo.Event.FilterBy(x => true).ToList();


            if (evts != null)
            {


                return evts;
            }
            else
            {
                return NotFound();
            }

        }
    }
}