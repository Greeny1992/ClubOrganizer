using MongoDB.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.DAL
{
    public class Club : MongoDocument
    {
        public string? Name { get; set; }  
        public Many<User> Members { get; set; } = new Many<User>();
        public Many<Group> Groups { get; set; } = new Many<Group>();
        public Many<Event> Events { get; set; } = new Many<Event>();

    }
}
