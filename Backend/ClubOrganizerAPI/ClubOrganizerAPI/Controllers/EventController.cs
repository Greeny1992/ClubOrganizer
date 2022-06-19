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

        [HttpPatch("PatchEvent")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Event))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Event>> PatchEvent([FromQuery][Required] String id, [Required][FromBody] Event eventData)
        {
            Event ev = await mongo.Event.FindByIdAsync(id);


            if (ev != null)
            {
                Event patch = await mongo.Event.UpdateOneAsync(eventData);


                return patch;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpDelete("DeleteEvent")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Event))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> DeleteEvent([FromQuery][Required] String id)
        {
            Event ev = await mongo.Event.FindByIdAsync(id);


            if (ev != null)
            {
                await mongo.Event.DeleteByIdAsync(id);


                return "Deleted Successfully";
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


        [HttpPost("UserAcceptEvent")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Event))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Event>> UserAcceptEvent([Required][FromQuery] string userId, [Required][FromQuery] string eventId)
        {
            Event ev = await mongo.Event.UserAcceptEvent(userId, eventId);

            if (ev != null)
            {


                return ev;
            }
            else
            {
                return NotFound();
            }

        }


        [HttpPost("UserCancleEvent")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Event))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Event>> UserCancleEvent([Required][FromQuery] string userId, [Required][FromQuery] string eventId)
        {
            Event ev = await mongo.Event.UserCancleEvent(userId, eventId);

            if (ev != null)
            {


                return ev;
            }
            else
            {
                return NotFound();
            }

        }
    }
}
