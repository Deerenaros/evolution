import "/js/bootstrap.bundle.js"
import "/js/jquery.min.js"

import { Vec, Genome, BinaryMarkov } from "/js/utils.js"

$(function () {
    const UPDATERATE = 1000/50

    let world = []

    world.coroutineid = 0
    world.height = 100
    world.width = 100
    world.solarity = $("#mutability").val()

    function coroutine(){
        world.forEach(somebody => {
            somebody.do()
        })
    }

    setTimeout(() => {
        world.height = $("#canvas").height()
        world.width = $("#canvas").width()
    }, 100)

    function refresh(name) {
        $(`#${name}-value`).text($(`#${name}`).val())
    }

    class creature {
        constructor(...genome) {
            let x = Math.round(Math.random() * 500)
            let y = Math.round(Math.random() * 500)

            this.genome = genome
            this.color = `#${genome.hash().hex(6)}55`
            this.html = $(`<div class='creature' style='background-color: ${this.color};'></div>`)
            this.vector = new Vec(0, 1)
            this.pos = new Vec(x, y)
            this.turn = new BinaryMarkov(0.05)
            this.change = new BinaryMarkov(0.01)
            this.height = 0
            this.width = 0

            setTimeout((thiz) => {
                thiz.height = thiz.html.height()
                thiz.width = thiz.html.width()
            }, 100, this)
        }

        do () {
            if (this.turn.raise()) {
                this.vector.rotate((this.change.raise() ? 1 : -1) * 5)
            }

            if(this.pos[0] > world.width - this.width) {
                this.vector.reflect(new Vec(-1, 0))
            } else if(this.pos[0] < 0) {
                this.vector.reflect(new Vec(1, 0))
            }

            if(this.pos[1] > world.height - this.height) {
                this.vector.reflect(new Vec(0, -1))
            } else if(this.pos[1] < 0) {
                this.vector.reflect(new Vec(0, 1))
            }

            this.pos.add(this.vector)

            let x = Math.round(this.pos[0])
            let y = Math.round(this.pos[1])


            this.html.css({ left: `${x}px`, top: `${y}px` })
        }
    }

    ["mutability", "solarity", "timespeed"].forEach((name) => {
        refresh(name)
        $(`#${name}`).on("input", () => {
            refresh(name)
        })
    })

    $("#timespeed").on("input", function() {
        clearInterval(world.coroutineid)
        if($(this).val() > 0) {
            world.coroutineid = setInterval(coroutine, UPDATERATE/$(this).val())
        }
    })

    $("#mutability").on("input", function() {
        world.mutability = $(this).val()
    })

    for (let i = 0; i < 10; i++) {
        let somebody = new creature(Genome.randomize(8), Genome.randomize(8), Genome.randomize(8))
        $("#canvas").append(somebody.html)
        world.push(somebody)
    }

    world.coroutineid = setInterval(coroutine, UPDATERATE)
})