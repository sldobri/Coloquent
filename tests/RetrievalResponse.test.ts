import {assert, expect} from 'chai';
import * as chai from 'chai';
import * as moxios from 'moxios';
import * as chaip from 'chai-as-promised';
import {Hero} from './model1/dummy/Hero';
import {Builder} from "../dist";
import {PaginationStrategy} from "../dist";
import {Response} from "../dist";
import {PluralResponse} from "../dist";
import {SortDirection} from "../dist";

chai.use(<any> chaip);

describe('Builder', () => {
    let builder: Builder;
    let model: Hero;

    beforeEach(() => {
        moxios.install();
        builder = new Builder(Hero);
        model = new Hero();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('should add models that are included more than once to all references', (done) => {
        model.foes()
            .with('foes')
            .get()
            .then((response: PluralResponse) => {
                let beefMan: Hero = <Hero> response.getData()[0];
                let carrotMan: Hero = <Hero> response.getData()[1];
                let eggplantManRef1: Hero = beefMan.getFoes()[0];
                let eggplantManRef2: Hero = carrotMan.getFoes()[0];

                assert(beefMan);
                assert(carrotMan);
                assert(eggplantManRef1);
                assert(eggplantManRef2);

                assert(beefMan.getName() === 'BeefMan');
                assert(carrotMan.getName() === 'CarrotMan');
                assert(eggplantManRef1.getName() === 'EggplantMan');
                assert(eggplantManRef2.getName() === 'EggplantMan');

                done();
            });

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            request.respondWith({
                response: {
                    data: [
                        {
                            type: "heroes",
                            id: "1",
                            attributes: {
                                name: "BeefMan"
                            },
                            relationships: {
                                foes: {
                                    data: [
                                        {
                                            type: "heroes",
                                            id: "3"
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            type: "heroes",
                            id: "2",
                            attributes: {
                                name: "CarrotMan"
                            },
                            relationships: {
                                foes: {
                                    data: [
                                        {
                                            type: "heroes",
                                            id: "3"
                                        }
                                    ]
                                }
                            }
                        },
                    ],
                    included: [
                        {
                            type: "heroes",
                            id: "3",
                            attributes: {
                                name: "EggplantMan"
                            }
                        }
                    ]
                }
            })
        });
    });
});