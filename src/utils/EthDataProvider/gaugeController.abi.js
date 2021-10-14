export const gaugeControllerAbi = [
  {
    name: "CommitOwnership",
    inputs: [
      {
        type: "address",
        name: "admin",
        indexed: false
      }
    ],
    anonymous: false,
    type: "event"
  },
  {
    name: "ApplyOwnership",
    inputs: [
      {
        type: "address",
        name: "admin",
        indexed: false
      }
    ],
    anonymous: false,
    type: "event"
  },
  {
    name: "AddType",
    inputs: [
      {
        type: "string",
        name: "name",
        indexed: false
      },
      {
        type: "int128",
        name: "type_id",
        indexed: false
      }
    ],
    anonymous: false,
    type: "event"
  },
  {
    name: "NewTypeWeight",
    inputs: [
      {
        type: "int128",
        name: "type_id",
        indexed: false
      },
      {
        type: "uint256",
        name: "time",
        indexed: false
      },
      {
        type: "uint256",
        name: "weight",
        indexed: false
      },
      {
        type: "uint256",
        name: "total_weight",
        indexed: false
      }
    ],
    anonymous: false,
    type: "event"
  },
  {
    name: "NewGaugeWeight",
    inputs: [
      {
        type: "address",
        name: "gauge_address",
        indexed: false
      },
      {
        type: "uint256",
        name: "time",
        indexed: false
      },
      {
        type: "uint256",
        name: "weight",
        indexed: false
      },
      {
        type: "uint256",
        name: "total_weight",
        indexed: false
      }
    ],
    anonymous: false,
    type: "event"
  },
  {
    name: "VoteForGauge",
    inputs: [
      {
        type: "uint256",
        name: "time",
        indexed: false
      },
      {
        type: "address",
        name: "user",
        indexed: false
      },
      {
        type: "address",
        name: "gauge_addr",
        indexed: false
      },
      {
        type: "uint256",
        name: "weight",
        indexed: false
      }
    ],
    anonymous: false,
    type: "event"
  },
  {
    name: "NewGauge",
    inputs: [
      {
        type: "address",
        name: "addr",
        indexed: false
      },
      {
        type: "int128",
        name: "gauge_type",
        indexed: false
      },
      {
        type: "uint256",
        name: "weight",
        indexed: false
      }
    ],
    anonymous: false,
    type: "event"
  },
  {
    outputs: [],
    inputs: [
      {
        type: "address",
        name: "_token"
      },
      {
        type: "address",
        name: "_voting_escrow"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    name: "commit_transfer_ownership",
    outputs: [],
    inputs: [
      {
        type: "address",
        name: "addr"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 37568
  },
  {
    name: "apply_transfer_ownership",
    outputs: [],
    inputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: 38407
  },
  {
    name: "gauge_types",
    outputs: [
      {
        type: "int128",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "_addr"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 1687
  },
  {
    name: "add_gauge",
    outputs: [],
    inputs: [
      {
        type: "address",
        name: "addr"
      },
      {
        type: "int128",
        name: "gauge_type"
      },
      {
        type: "uint256",
        name: "weight"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 18123433774
  },
  {
    name: "checkpoint",
    outputs: [],
    inputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: 18033775892
  },
  {
    name: "checkpoint_gauge",
    outputs: [],
    inputs: [
      {
        type: "address",
        name: "addr"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 18087670272
  },
  {
    name: "gauge_relative_weight",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "addr"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    name: "gauge_relative_weight",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "addr"
      },
      {
        type: "uint256",
        name: "time"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    name: "gauge_relative_weight_write",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "addr"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    name: "gauge_relative_weight_write",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "addr"
      },
      {
        type: "uint256",
        name: "time"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    name: "add_type",
    outputs: [],
    inputs: [
      {
        type: "string",
        name: "_name"
      },
      {
        type: "uint256",
        name: "weight"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 36246441594
  },
  {
    name: "change_type_weight",
    outputs: [],
    inputs: [
      {
        type: "int128",
        name: "type_id"
      },
      {
        type: "uint256",
        name: "weight"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 36246292943
  },
  {
    name: "change_gauge_weight",
    outputs: [],
    inputs: [
      {
        type: "address",
        name: "addr"
      },
      {
        type: "uint256",
        name: "weight"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 36354153634
  },
  {
    name: "vote_for_gauge_weights",
    outputs: [],
    inputs: [
      {
        type: "address",
        name: "_gauge_addr"
      },
      {
        type: "uint256",
        name: "_user_weight"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 18142043388
  },
  {
    name: "get_gauge_weight",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "addr"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2945
  },
  {
    name: "get_type_weight",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "int128",
        name: "type_id"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2978
  },
  {
    name: "get_total_weight",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 2603
  },
  {
    name: "get_weights_sum_per_type",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "int128",
        name: "type_id"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 3110
  },
  {
    name: "change_global_emission_rate",
    outputs: [],
    inputs: [
      {
        type: "uint256",
        name: "new_rate"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    gas: 36808
  },
  {
    name: "admin",
    outputs: [
      {
        type: "address",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 1781
  },
  {
    name: "future_admin",
    outputs: [
      {
        type: "address",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 1811
  },
  {
    name: "token",
    outputs: [
      {
        type: "address",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 1841
  },
  {
    name: "voting_escrow",
    outputs: [
      {
        type: "address",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 1871
  },
  {
    name: "n_gauge_types",
    outputs: [
      {
        type: "int128",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 1901
  },
  {
    name: "n_gauges",
    outputs: [
      {
        type: "int128",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 1931
  },
  {
    name: "gauge_type_names",
    outputs: [
      {
        type: "string",
        name: ""
      }
    ],
    inputs: [
      {
        type: "int128",
        name: "arg0"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 8659
  },
  {
    name: "gauges",
    outputs: [
      {
        type: "address",
        name: ""
      }
    ],
    inputs: [
      {
        type: "uint256",
        name: "arg0"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2100
  },
  {
    name: "vote_user_slopes",
    outputs: [
      {
        type: "uint256",
        name: "slope"
      },
      {
        type: "uint256",
        name: "power"
      },
      {
        type: "uint256",
        name: "end"
      }
    ],
    inputs: [
      {
        type: "address",
        name: "arg0"
      },
      {
        type: "address",
        name: "arg1"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 4667
  },
  {
    name: "vote_user_power",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "arg0"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2266
  },
  {
    name: "last_user_vote",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "arg0"
      },
      {
        type: "address",
        name: "arg1"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2511
  },
  {
    name: "points_weight",
    outputs: [
      {
        type: "uint256",
        name: "bias"
      },
      {
        type: "uint256",
        name: "slope"
      }
    ],
    inputs: [
      {
        type: "address",
        name: "arg0"
      },
      {
        type: "uint256",
        name: "arg1"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 3675
  },
  {
    name: "time_weight",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "address",
        name: "arg0"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2356
  },
  {
    name: "points_sum",
    outputs: [
      {
        type: "uint256",
        name: "bias"
      },
      {
        type: "uint256",
        name: "slope"
      }
    ],
    inputs: [
      {
        type: "int128",
        name: "arg0"
      },
      {
        type: "uint256",
        name: "arg1"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 3816
  },
  {
    name: "time_sum",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "uint256",
        name: "arg0"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2310
  },
  {
    name: "points_total",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "uint256",
        name: "arg0"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2346
  },
  {
    name: "time_total",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 2261
  },
  {
    name: "points_type_weight",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "int128",
        name: "arg0"
      },
      {
        type: "uint256",
        name: "arg1"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2702
  },
  {
    name: "time_type_weight",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [
      {
        type: "uint256",
        name: "arg0"
      }
    ],
    stateMutability: "view",
    type: "function",
    gas: 2430
  },
  {
    name: "global_emission_rate",
    outputs: [
      {
        type: "uint256",
        name: ""
      }
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
    gas: 2351
  }
];
