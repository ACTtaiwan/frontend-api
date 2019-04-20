import * as _ from 'lodash';

const meta = [
  {
    'chamber': [],
    'code': 'unknown',
    'en': {
      'name': 'Unknown Text Version',
      'description': 'Unknown Text Version',
    },
    'zh': {
      'name': '未知版本',
      'description': '未知版本'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'rcs',
    'en': {
      'name': 'Reference Change Senate',
      'description': 'An alternate name for this version is Referred to Different or Additional Senate Committee. This version is a bill or resolution as it was re-referred to a different or additional Senate committee. It may have been discharged from the committee to which it was originally referred then referred to a different committee, referred to an additional committee sequentially, or reported by the original committee then referred to an additional committee. See H.R. 1502 from the 105th Congress for an example of this bill version on a House bill.',
    },
    'zh': {
      'name': '參議院再次提交眾議院待審法案予其他或新增的委員會審議',
      'description': '此版本是參議院把法案或決議案再次提交給不同或新增的參議院委員會審議。此法案或決議可能被原本的委員會撤案後，提交給不同或新增的參議院委員會，或者經原委員會提出報告後提交予新增的委員會審議。可參考眾議院105屆會期之H.R.1502號法案。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'res',
    'en': {
      'name': 'Re-engrossed Amendment Senate',
      'description': 'This version is a re-engrossed amendment in the Senate. See also Engrossed Amendment Senate.',
    },
    'zh': {
      'name': '重新通過之參議院草案',
      'description': '此版本為在參議院中重新通過之草案。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'rdh',
    'en': {
      'name': 'Received in House',
      'description': 'An alternate name for this bill version is Received in House from Senate. This version is a bill or resolution as passed or agreed to in the Senate which has been sent to and received in the House. See the 105th Congress for an example of this bill version.',
    },
    'zh': {
      'name': '經參議院同意後送交至眾議院之版本',
      'description': '此版本是參議院通過、同意後之法案或決議，現已送交眾議院。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'ips',
    'en': {
      'name': 'Indefinitely Postponed Senate',
      'description': 'This version is a bill or resolution as it was when consideration was suspended with no date specified for continuing its consideration.',
    },
    'zh': {
      'name': '參議院無限期停止審議的法案之決議案',
      'description': '此法案版本被參議院停止審議且並無設定接下來的審議日期。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'eph',
    'en': {
      'name': 'Engrossed and Deemed Passed by House',
      'description': 'This version is the official copy of the bill or joint resolution as passed and certified by the Clerk of the House before it is sent to the Senate. See H. J. RES. 280 from the 101st Congress for an example of this bill version.',
    },
    'zh': {
      'name': '眾議院通過而送交參議院前的草案',
      'description': '此版本為送交參議院前已由眾議院正式通過之法案或聯合決議案，並由眾議院書記官認證。'
    }
  },
  {
    'chamber': ['house', 'senate', 'joint'],
    'code': 'enr',
    'en': {
      'name': 'Enrolled Bill',
      'description': 'An alternate name for this version is Enrolled as Agreed to or Passed by Both House and Senate. This version is the final official copy of the bill or joint resolution which both the House and the Senate have passed in identical form. After it is certified by the chief officer of the house in which it originated (the Clerk of the House or the Secretary of the Senate), then signed by the House Speaker and the Senate President Pro Tempore, the measure is sent to the President for signature.',
    },
    'zh': {
      'name': '重新通過之法案',
      'description': '此版本已被重新通過。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'rts',
    'en': {
      'name': 'Referred to Committee Senate',
      'description': 'Bill or resolution as referred or re-referred to a Senate committee or committees.',
    },
    'zh': {
      'name': '已提交或再次提交至參議院委員會或委員之版本',
      'description': '此版本係已提交或再次提交予參議院委員會之法案或決議案。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'cds',
    'en': {
      'name': 'Committee Discharged Senate',
      'description': 'An alternate name for this version is Senate Committee Discharged from Further Consideration. This version is a bill or resolution as it was when the committee to which the bill or resolution has been referred has been discharged from its consideration to make it available for floor consideration.',
    },
    'zh': {
      'name': '參議院委員會已完成法案或決議案之審議',
      'description': '此版本係已由被提交法案或決議案的參議院委員會完成審議，且委員會已被解除職務；本版本可逕付參議院全體委員會進行審議。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'sc',
    'en': {
      'name': 'Sponsor Change',
      'description': 'This version is used to change sponsors.',
    },
    'zh': {
      'name': '法案提案人之變更',
      'description': '此版本用於變更法案提案人。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'ath',
    'en': {
      'name': 'Agreed to House',
      'description': 'An alternate name for this version is Agreed to by House. This version is a simple or concurrent resolution as agreed to in the House of Representatives.',
    },
    'zh': {
      'name': '經眾議院同意之簡易決議或共同決議',
      'description': '此版本是已由眾議院同意之簡易決議或共同決議。'
    }
  },
  {
    'chamber': ['house', 'senate', 'joint'],
    'code': 'renr',
    'en': {
      'name': 'Re-enrolled Bill',
      'description': 'This version has been re-enrolled.',
    },
    'zh': {
      'name': '重新通過之法案',
      'description': '此版本已被重新通過。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'reah',
    'en': {
      'name': 'Re-engrossed Amendment House',
      'description': 'This version is a re-engrossed amendment in the House.',
    },
    'zh': {
      'name': '重新通過之眾議院草案',
      'description': '此版本為在眾議院中重新通過之草案。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'rfs',
    'en': {
      'name': 'Referred in Senate',
      'description': 'An alternate name for this bill version is Referred to Senate Committee after being Received from House. This version is a bill or resolution as passed or agreed to in the House which has been sent to, received in the Senate, and referred to Senate committee or committees.',
    },
    'zh': {
      'name': '送交參議院後已由參議院提交予參議院委員會之版本',
      'description': '此版本是眾議院通過、同意後之法案或決議，經送交參議院後被提交至參議院委員會。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'fph',
    'en': {
      'name': 'Failed Passage House',
      'description': 'Bill or resolution that failed to pass the House.',
    },
    'zh': {
      'name': '未能通過眾議院決議之法案或決議案',
      'description': '此版本表示法案或決議案未能通過眾議院之審議。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'hds',
    'en': {
      'name': 'Held at Desk Senate',
      'description': 'An alternate name for this bill version is Ordered Held at Senate Desk after being Received from House. This version is a bill or resolution as received in the Senate from the House which has been ordered to be held at the desk, sometimes in preparation for going to conference. It is available to be called up for consideration by unanimous consent.',
    },
    'zh': {
      'name': '暫保留於參議院',
      'description': '此版本係參議院收到法案或決議案後暫保留而待委員會討論；此版本已無異議可進行審議。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'rds',
    'en': {
      'name': 'Received in Senate',
      'description': 'An alternate name for this bill version is Received in Senate from House. This version is a bill or resolution as it was passed or agreed to in the House which has been sent to and received in the Senate.',
    },
    'zh': {
      'name': '經眾議院同意後送交至參議院之版本',
      'description': '此版本是眾議院通過、同意後之法案或決議，現已送交參議院。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'cdh',
    'en': {
      'name': 'Committee Discharged House',
      'description': 'An alternate name for this version is House Committee Discharged from Further Consideration. This version is a bill or resolution as it was when the committee to which the bill or resolution has been referred has been discharged from its consideration to make it available for floor consideration.',
    },
    'zh': {
      'name': '眾議院委員會已完成法案或決議案之審議',
      'description': '此版本係已由被提交法案或決議案的眾議院委員會完成審議，且委員會已被解除職務；本版本可逕付眾議院全體委員會進行審議。'
    }
  },
  {
    'chamber': ['joint'],
    'code': 'pl',
    'en': {
      'name': 'Public Law',
      'description': 'Enacted bills and joint resolutions will receive public law (PL) numbers from NARA. PL numbers link to slip law texts after they have been published by GPO.',
    },
    'zh': {
      'name': '公法',
      'description': '已頒布之法案及聯合決議案。將會有PL編號。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'cph',
    'en': {
      'name': 'Considered and Passed House',
      'description': 'Considered and Passed House – An alternate name for this version is Considered and Passed by House. This version is a bill or joint resolution as considered and passed.',
    },
    'zh': {
      'name': '經眾議院審議通過之版本',
      'description': '此版本係已由眾議院審議並通過之法案或聯合決議。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'as',
    'en': {
      'name': 'Amendment Ordered to be Printed Senate',
      'description': 'An alternate name for this version is Senate Amendment Ordered to be Printed. This version contains an amendment that has been ordered to be printed.',
    },
    'zh': {
      'name': '命令刊印之參議院增修條文',
      'description': '命令印製參議院增修條文。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'eh',
    'en': {
      'name': 'Engrossed in House',
      'description': 'An alternate name for this version is Engrossed as Agreed to or Passed by House. This version is the official copy of the bill or joint resolution as passed, including the text as amended by floor action, and certified by the Clerk of the House before it is sent to the Senate.',
    },
    'zh': {
      'name': '眾議院通過之草案最終版本',
      'description': '此版本為送交參議院前已由眾議院通過之法案或決議案的最終草案版本；本版本包含眾議院全體委員會所增修之文本，並已由眾議院書記官完成認證。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'rs',
    'en': {
      'name': 'Reported in Senate',
      'description': `This version is a bill or resolution as reported by the committee or one of the committees to which it was referred, including changes, if any, made in committee. The bill or resolution is usually accompanied by a committee report which describes the measure, the committee's views on it, its costs, and the changes it proposes to make in existing law. The bill or resolution is then available for floor consideration.`,
    },
    'zh': {
      'name': '於參議院全體委員會中報告之版本',
      'description': '此版本係已可交由參議院全體委員會審議之法案或決議案。本版本含委員會對該提案草案所提出之意見或修改。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'cps',
    'en': {
      'name': 'Considered and Passed Senate',
      'description': 'An alternate name for this version is Considered and Passed by Senate. This version is a bill or joint resolution as considered and passed.',
    },
    'zh': {
      'name': '經參議院審議通過之版本',
      'description': '此版本係已由參議院審議並通過之法案或聯合決議。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'ris',
    'en': {
      'name': 'Referral Instructions Senate',
      'description': 'An alternate name for this bill version is Referred to Senate Committee with Instructions. This version is a bill or resolution as referred or re-referred to committee with instructions to take some action on it. Often in the Senate the instructions require the committee to report the measure forth with specified amendments.',
    },
    'zh': {
      'name': '提交至參議院之訓令',
      'description': '此版本為提交或再次提交含訓令之法案或決議案給委員會，要求委員會依照此訓令採取相關行動。通常在參議院中，此訓令是要求委員會針對法案或決議案報告具體修訂之措施或方針。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'lth',
    'en': {
      'name': 'Laid on Table in House',
      'description': 'This version is a bill or resolution as laid on the table which disposes of it immediately, finally, and adversely via a motion without a direct vote on its substance.',
    },
    'zh': {
      'name': '停滯於眾議院立法程序',
      'description': '此版本停滯於眾議院立法程序。復議動議被擱置。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'ash',
    'en': {
      'name': 'Additional Sponsors House',
      'description': 'An alternate name for this version is House Sponsors or Cosponsors Added or Withdrawn. This version is used to add or delete cosponsor names. When used, it most often shows numerous cosponsors being added.',
    },
    'zh': {
      'name': '新增或刪除眾議院法案提案人',
      'description': '此版本用於新增或刪除法案提案人或共同提案人。最常使用的情況是新增共同提案人。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'rih',
    'en': {
      'name': 'Referral Instructions House',
      'description': 'An alternate name for this bill version is Referred to House Committee with Instructions. This version is a bill or resolution as referred or re-referred to committee with instructions to take some action on it. Invariably in the House the instructions require the committee to report the measure forthwith with specified amendments.',
    },
    'zh': {
      'name': '提交至眾議院之訓令',
      'description': '此版本為提交或再次提交含訓令之法案或決議案給委員會，要求委員會依照此訓令採取相關行動。通常在眾議院中，此訓令是要求委員會就法案或決議案報告具體修訂之措施或方針。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'sas',
    'en': {
      'name': 'Additional Sponsors Senate',
      'description': 'Additional sponsors have been added to this version.',
    },
    'zh': {
      'name': '新增參議院法案提案人',
      'description': '此版本新增參議院法案提案人。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'is',
    'en': {
      'name': 'Introduced in Senate',
      'description': 'This version is a bill or resolution as formally presented by a member of Congress to a clerk when the Senate is in session.',
    },
    'zh': {
      'name': '提交至參議院',
      'description': '此版本為參議員在會期中正式提交予參議院秘書之法案或決議案。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'hdh',
    'en': {
      'name': 'Held at Desk House',
      'description': 'An alternate name for this bill version is Ordered Held at House Desk after being Received from House. This version has been held at the desk in the House.',
    },
    'zh': {
      'name': '暫保留於眾議院',
      'description': '此版本係眾議院收到法案或決議案後暫保留而待委員會討論；此版本已無異議可進行審議。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'pp',
    'en': {
      'name': 'Public Print',
      'description': 'Any bill from the House or Senate may be issued as a public print. If a bill is issued as a Public Print more copies will be printed than are printed for an engrossed version. Public prints also number the amendments made by the last chamber to pass it. Public Prints are typically published by the Senate to show Senate amendments to House bills. They typically contain the text of a House bill, indicating portions struck, plus Senate amendments in italics. They are routinely ordered for appropriations bills, but the Senate occasionally by unanimous consent orders public prints of other significant bills.',
    },
    'zh': {
      'name': '公開版法案',
      'description': '任何眾議院或參議院的法案均可被發佈為公開版法案。若法案被發佈為公開版法案，副本刊印之數量將多於正式法案全文版的刊印數量。一般來說，公開版法案中也會列舉出最後議院通過的增修條文。公開版法案通常由參議院發佈就眾議院的法案版本提出增修條文；內容通常包含原眾議院版法案，標明須修改部分，並用斜體標記參議院的修訂。這樣的修訂常規例行地用於撥款法案上，但參議院有時會一致同意公開發佈其他重要法案。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'pav',
    'en': {
      'name': 'Previous Action Vitiated',
      'description': 'This version is a bill or resolution as it was when an action previously taken on it was undone or invalidated. For example in the 102nd Congress for H.R. 2321 the Senate action discharging the Energy Committee and amending and passing the bill was vitiated by unanimous consent. The bill was amended, reported, and passed anew.',
    },
    'zh': {
      'name': '前行為之瑕疵',
      'description': '此版本是因有未完成或無效的前行為使法案或決議案仍為原樣。例如，在第102屆國會的眾議院H.R. 2321號法案，參議院解除能源委員會並藉由參議院一致同意而直接修改和通過該法案的行動使其產生瑕疵。該法案經過修改，報告後再重新通過。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'rch',
    'en': {
      'name': 'Reference Change House',
      'description': 'An alternate name for this bill version is Referred to Different or Additional House Committee. This version is a bill or resolution as re-referred to a different or additional House committee. It may have been discharged from the committee to which it was originally referred then referred to a different committee, referred to an additional committee sequentially, or reported by the original committee then referred to an additional committee. See S. 1016 for an example of this bill version on a Senate bill.',
    },
    'zh': {
      'name': '眾議院再次提交參議院待審法案予其他或新增的委員會審議',
      'description': '此版本是眾議院把法案或決議案再次提交給不同或新增的眾議院委員會審議。此法案或決議可能被原本的委員會撤案後，提交給不同或新增的眾議院委員會，或者經原委員會提出報告後提交予新增的委員會審議。可參考參議院S.1016號法案。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'rfh',
    'en': {
      'name': 'Referred in House',
      'description': 'An alternate name for this bill version is Referred to House Committee after being Received from Senate. This version is a bill or resolution as passed or agreed to in the Senate which has been sent to, received in the House, and referred to House committee or committees.',
    },
    'zh': {
      'name': '送交眾議院後已由眾議院提交予眾議院委員會之版本',
      'description': '此版本是參議院通過、同意後之法案或決議，經送交眾議院後被提交至眾議院委員會。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'eah',
    'en': {
      'name': 'Engrossed Amendment House',
      'description': 'An alternate name for this version is Engrossed Amendment as Agreed to by House. This version is the official copy of a bill or joint resolution as passed, including the text as amended by floor action, and certified by the Clerk of the House before it is sent to the Senate. Often this is the engrossment of an amendment in the nature of a substitute, an amendment which replaces the entire text of a measure. It strikes out everything after the enacting or resolving clause and inserts a version which may be somewhat, substantially, or entirely different.',
    },
    'zh': {
      'name': '眾議院之原議案全案替代案',
      'description': '此為送交參議院前之法案或共同決議案之正式增修條文；本版本包含眾議院全體議員通過之修改文本，並已由眾議院書記官認證。通常這是原議案全案替代案之謄清，是增修條文取代全文之方法。此替代案會刪除制定用語及決議用語後之文字，而加入可能實質上不同或完全不同的版本。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'lts',
    'en': {
      'name': 'Laid on Table in Senate',
      'description': 'This version was laid on the table in the Senate. See also Laid on Table in House.',
    },
    'zh': {
      'name': '停滯於參議院立法程序',
      'description': '此版本停滯於參議院立法程序。參見停滯於眾議院立法程序。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'pwh',
    'en': {
      'name': 'Ordered to be Printed with House Amendment',
      'description': 'This version shows Senate amendments to a House bill. It is similar to a Public Print from the Senate, except that it does not include portions struck, only the Senate amendment in the nature of a substitute in italics. See S. 1059 from the 106th Congress for an example of this bill version on a Senate bill.',
    },
    'zh': {
      'name': '命令刊印之眾議院增修條文',
      'description': '此版本為參議院就眾議院法案所做之修訂。除了沒有包含刪除的條文，且只含了參議院替代後的修正條文外，此版本與參議院的公開版法案相似，修正條文以斜體呈現。請參見參議院法案S.1059號。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'es',
    'en': {
      'name': 'Engrossed in Senate',
      'description': 'An alternate name for this version is Engrossed as Agreed to or Passed by Senate. This version is the official copy of the bill or joint resolution as passed, including the text as amended by floor action, and certified by the Secretary of the Senate before it is sent to the House.',
    },
    'zh': {
      'name': '參議院通過之草案最終版本',
      'description': '此版本為送交眾議院前已由參議院通過之法案或決議案的最終草案版本；本版本包含參議院全體委員會所增修之文本，並已由參議院秘書完成認證。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'fah',
    'en': {
      'name': 'Failed Amendment House',
      'description': 'This amendment has failed in the House.',
    },
    'zh': {
      'name': '未能通過眾議院決議之增修條文',
      'description': '此增修條文未能通過眾議院之審議。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'ops',
    'en': {
      'name': 'Ordered to be Printed Senate',
      'description': 'This version was ordered to be printed by the Senate. For example, in the 105th Congress S. 1173 was considered at length by the Senate, returned to the Senate calendar, ordered to be printed. Then its text was inserted into its companion House bill which was passed by the Senate.',
    },
    'zh': {
      'name': '參議院命令刊印之版本',
      'description': '參議院命令印製之版本。例如，於105屆國會，參議院S.1173號法案由參議院審議後，參議院命令其列於參議院日程進行刊印。之後此文本會被放入於經參議院通過之眾議院法案中。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'rh',
    'en': {
      'name': 'Reported in House',
      'description': `This version is a bill or resolution as reported by the committee or one of the committees to which it was referred, including changes, if any, made in committee. The bill or resolution is usually accompanied by a committee report which describes the measure, the committee's views on it, its costs, and the changes it proposes to make in existing law. The bill or resolution is then available for floor consideration. This version occurs to both House and Senate bills.`,
    },
    'zh': {
      'name': '於眾議院全體委員會中報告之版本',
      'description': '此版本係已可交由眾議院全體委員會審議之法案或決議案。本版本含委員會對該提案草案所提出之意見或修改。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'pcs',
    'en': {
      'name': 'Placed on Calendar Senate',
      'description': 'This version is a bill or resolution as placed on one of the two Senate calendars. It is eligible for floor consideration, but a place on a calendar does not guarantee consideration.',
    },
    'zh': {
      'name': '列於參議院的會程表中',
      'description': '此版本為已列於參議院任一會程表中的法案或決議案(參議院有立法與行政兩種會程表)。參議員可於會議進行時提出將此法案或決議案放入會程討論，但此舉並不保證此法案或決議案定會被審議。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'ats',
    'en': {
      'name': 'Agreed to Senate',
      'description': 'An alternate name for this version is Agreed to by Senate. This version is a simple or concurrent resolution as agreed to in the Senate.',
    },
    'zh': {
      'name': '經參議院同意之簡易決議或共同決議',
      'description': '此版本是已由參議院同意之簡易決議或共同決議。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'iph',
    'en': {
      'name': 'Indefinitely Postponed House',
      'description': 'This version is a bill or resolution as it was when consideration was suspended with no date specified for continuing its consideration.',
    },
    'zh': {
      'name': '眾議院無限期停止審議之法案或決議案',
      'description': '此法案版本為被眾議院停止審議且並無設定接下來的審議日期之法案。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'rah',
    'en': {
      'name': 'Referred with Amendments House',
      'description': 'This version was referred with amendments to the House.',
    },
    'zh': {
      'name': '參照眾議院增修條文之版本',
      'description': '此版本係參照眾議院之增修條文'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'pap',
    'en': {
      'name': 'Printed as Passed',
      'description': 'This version is a public print of a bill as passed. Generally, appropriation bills receive a PP designation while non-appropriation bills receive a PAP designation. See also Public Print.',
    },
    'zh': {
      'name': '刊印通過之法案',
      'description': '此版本為已通過且正式刊印之法案。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'ras',
    'en': {
      'name': 'Referred with Amendments Senate',
      'description': 'This version was referred with amendments to the Senate.',
    },
    'zh': {
      'name': '參照參議院增修條文之版本',
      'description': '此版本係參照參議院之增修條文。'
    }
  },
  {
    'chamber': ['senate'],
    'code': 'fps',
    'en': {
      'name': 'Failed Passage Senate',
      'description': 'Bill or resolution that failed to pass the Senate.',
    },
    'zh': {
      'name': '未能通過參議院決議之法案或決議案',
      'description': '此版本表示法案或決議案未能通過參議院之審議。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'ih',
    'en': {
      'name': 'Introduced in House',
      'description': 'This version is a bill or resolution as formally presented by a member of Congress to a clerk when the House is in session.',
    },
    'zh': {
      'name': '提交至眾議院',
      'description': '此版本為眾議員在會期中正式提交予眾議院書記官之法案或決議案。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'rth',
    'en': {
      'name': 'Referred to Committee House',
      'description': 'Bill or resolution as referred or re-referred to a House committee or committees. See 104th Congress for an example of this bill version.',
    },
    'zh': {
      'name': '已提交或再次提交至眾議院委員會或委員之版本',
      'description': '此版本係已提交或再次提交予眾議院委員會之法案或決議案。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'eas',
    'en': {
      'name': 'Engrossed Amendment Senate',
      'description': 'An alternate name for this version is Engrossed Amendment as Agreed to by Senate. This version is the official copy of the amendment to a bill or joint resolution as passed, including the text as amended by floor action, and certified by the Secretary of the Senate before it is sent to the House. Often this is the engrossment of an amendment in the nature of a substitute, an amendment which replaces the entire text of a measure. It strikes out everything after the enacting or resolving clause and inserts a version which may be somewhat, substantially, or entirely different.',
    },
    'zh': {
      'name': '參議院之原議案全案替代案',
      'description': '此為送交眾議院前之法案或共同決議案之正式增修條文；本版本包含參議院全體議員通過之修改文本，並已由參議院秘書認證。通常這是原議案全案替代案之謄清，是增修條文取代全文之方法。此替代案會刪除制定用語及決議用語後之文字，而加入可能實質上不同或完全不同的版本。'
    }
  },
  {
    'chamber': ['house'],
    'code': 'oph',
    'en': {
      'name': 'Ordered to be Printed House',
      'description': 'This version was ordered to be printed by the House. See also Ordered to be Printed Senate.',
    },
    'zh': {
      'name': '眾議院命令刊印之版本',
      'description': '眾議院命令印製之版本。'
    }
  },
  {
    'chamber': ['house', 'senate'],
    'code': 'pch',
    'en': {
      'name': 'Placed on Calendar House',
      'description': 'This version is a bill or resolution as placed on one of the five House calendars. It is eligible for floor consideration, but a place on a calendar does not guarantee consideration.',
    },
    'zh': {
      'name': '列於眾議院的會程表中',
      'description': '此版本為已列於眾議院任一會程表中的法案或決議案(眾議院共有五個會程表)。眾議員可於會議進行時提出將此法案或決議案放入議程討論，但此舉並不保證此法案或決議案定會被審議。'
    }
  }
];

export default _.keyBy(meta, 'code');
