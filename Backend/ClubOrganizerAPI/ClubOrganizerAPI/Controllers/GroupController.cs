using Context;
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
    public class GroupController : ControllerBase
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;

        [HttpPost("CreatGroup")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Group))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Group>> CreateEvent([Required][FromBody] Group groupData)
        {
            Group gr = await mongo.Group.InsertOrUpdateOneAsync(groupData);


            if (gr != null)
            {


                return gr;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet("ListGroups")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Group>))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<Group>>> ListGroups()
        {


            List<Group> grps = mongo.Group.FilterBy(x => true).ToList();


            if (grps != null)
            {


                return grps;
            }
            else
            {
                return NotFound();
            }

        }
    }
}
